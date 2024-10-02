package websocket

import(
    "bufio"
    "fmt"
    "github.com/gorilla/websocket"
    "log"
    "net/http"
    "net/url"
    "os"
    "strings"
	"gdsc/internal/translator"
)

var addr = "localhost:8080"
var username string

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool{
		return true
	},
}

var clients = make(map[*websocket.Conn]string)
var broadcast = make(chan Message)


type Message struct {
	Sender string `json:"sender"`
	Recipient string `json:"recipient"`
	Content string `json:"content"`

}
func StartServer(){
	http.HandleFunc("/ws", handleConnections)
	go handleMessages()

	fmt.Println("Server started on: 8080")
	err := http.ListenAndServe(":8080", nil)

	if err != nil {
		http.ListenAndServe(":8080", nil)
	}
	
}


func handleConnections(w http.ResponseWriter, r *http.Request) {
    // Upgrade initial GET request to a WebSocket
    ws, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Println("Upgrade error:", err)
        return
    }
    defer ws.Close()



    err = ws.WriteMessage(websocket.TextMessage, []byte(strings.TrimSpace("Enter your username: ")))
    if err != nil {
        log.Println("WriteMessage error:", err)
        return
    }

   
    _, msg, err := ws.ReadMessage()
    if err != nil {
        log.Println("ReadMessage error:", err)
        return
    }

    username := string(msg)
    clients[ws] = username
    fmt.Printf("User connected: %s\n", username)


	userLangPrefs := map[string]string{
		"sourceLang": "en",
		"targetLang": "en",
	}
    // Continuously listen for messages
    for {
        _, msg, err := ws.ReadMessage()
        if err != nil {
            log.Printf("Error: %v", err)
            delete(clients, ws) // Remove client on error or disconnect
            break
        }

		messageText := string(msg)
		if strings.HasPrefix(messageText, "lang:") {
			parts := strings.Split(strings.TrimPrefix(messageText, "lang:"), "->")
			if len(parts) == 2{
				userLangPrefs["sourceLang"] = parts[0]
				userLangPrefs["targetLang"] = parts[1]
				ws.WriteMessage(websocket.TextMessage, []byte("Language preferences updated: " + userLangPrefs["sourceLang"] + "->" + userLangPrefs["targetLang"]))
				continue
			}
		}
        messageParts := strings.SplitN(string(msg), " ", 2)
        if len(messageParts) < 2 || !strings.HasPrefix(messageParts[0], "@") {
            ws.WriteMessage(websocket.TextMessage, []byte("Invalid message format. Use @username message."))
            continue
        }

        recipient := strings.TrimPrefix(messageParts[0], "@")
        content := messageParts[1]

		translatedMessage, err := translator.TranslateText(content, "en", "fr") // Example: translate from Chinese to English
        if err != nil {
            ws.WriteMessage(websocket.TextMessage, []byte("Translation failed: "+err.Error()))
            continue
        }

        // Send the message to the broadcast channel
        broadcast <- Message{Sender: username, Recipient: recipient, Content: translatedMessage}
    }
}


func handleMessages() {
	for {

		msg := <-broadcast
		for client, username := range clients {
			if username == msg.Recipient {
				err := client.WriteMessage(websocket.TextMessage, []byte(fmt.Sprintf("Message from %s: %s", msg.Sender, msg.Content)))
				if err != nil {
					log.Printf("write error: %v", err)
					client.Close()
					delete(clients, client)
				}
				break
			}
		}
	}
}

func StartClient() {
	// Use "ws" for non-secure WebSocket connections
	u := url.URL{Scheme: "ws", Host: addr, Path: "/ws"}
	fmt.Printf("Connecting to %s\n", u.String())

	conn, _, err := websocket.DefaultDialer.Dial(u.String(), nil)
	if err != nil {
		log.Fatal("Dial error:", err)
	}
	defer conn.Close()

	// Receive prompt for username and send username
	_, msg, err := conn.ReadMessage()
	if err != nil {
		log.Println("ReadMessage error:", err)
		return
	}
	fmt.Printf("%s\n", msg) // Server asks for username

	reader := bufio.NewReader(os.Stdin)
    username, _ := reader.ReadString('\n')
    username = strings.TrimSpace(username)  // Trim any newline characters from the input

	err = conn.WriteMessage(websocket.TextMessage, []byte(username)) 
	if err != nil {
		log.Println("WriteMessage error:", err)
		return
	}

	var sourceLang, targetLang string
	fmt.Print("Enter the source language code (e.g., 'en' for English, 'zh' for Chinese): ")
	fmt.Scan(&sourceLang)
	fmt.Print("Enter the target language code (e.g., 'en' for English, 'fr' for French): ")
    fmt.Scan(&targetLang)

	err = conn.WriteMessage(websocket.TextMessage, []byte("lang:"+sourceLang+"->"+targetLang))
    if err != nil {
        log.Println("Error sending language preferences:", err)
        return
    }
	// Start reading messages from the server in a separate goroutine
	go func() {
		for {
			_, message, err := conn.ReadMessage()
			if err != nil {
				log.Println("ReadMessage error:", err)
				return
			}
			fmt.Printf("\n%s\n", message) // Print received message
			fmt.Print("Type your message in the format @username message: ") // Print prompt again
		}
	}()

	// Continuously send messages to the server
	for {
		fmt.Print("Type your message in the format @username message: ")
		reader := bufio.NewReader(os.Stdin)
		message, _ := reader.ReadString('\n')

		if strings.ToLower(message) == "quit\n"{
			fmt.Println("Exiting Chat...")
			err = conn.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure,""))
			if err != nil {
				log.Println("WriteMessage error:", err)
			}
			return
		}

		err = conn.WriteMessage(websocket.TextMessage, []byte(message))
		if err != nil {
			log.Println("WriteMessage error: ", err)
			return
		}
	}
}

