package websocket

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var clients = make(map[*websocket.Conn]string) // map WebSocket connection to usernames
var broadcast = make(chan Message)             // channel to broadcast messages

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// Message defines the structure for sending and receiving messages
type Message struct {
	Sender    string `json:"sender"`
	Recipient string `json:"recipient"`
	Content   string `json:"content"`
}

// StartServer initializes the WebSocket server
func StartServer() {
	http.HandleFunc("/ws", handleConnections)
	go handleMessages()

	fmt.Println("WebSocket server started on :8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("ListenAndServe:", err)
	}
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	// Upgrade initial HTTP request to a WebSocket connection
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Upgrade error:", err)
		return
	}
	defer ws.Close()

	// Extract username from URL query
	username := r.URL.Query().Get("username")
	clients[ws] = username
	fmt.Printf("User connected: %s\n", username)

	// Continuously listen for messages
	for {
		var msg Message
		err := ws.ReadJSON(&msg) // Read the message as JSON
		if err != nil {
			log.Printf("Error: %v", err)
			delete(clients, ws) // Remove the client on error
			break
		}

		// Broadcast the message to the recipient
		broadcast <- msg
	}
}

func handleMessages() {
	for {
		// Wait for a message from the broadcast channel
		msg := <-broadcast

		// Find the recipient and send the message
		for client, username := range clients {
			if username == msg.Recipient {
				err := client.WriteJSON(msg) // Send message as JSON
				if err != nil {
					log.Printf("Error sending message to %s: %v", username, err)
					client.Close()
					delete(clients, client)
				}
				break
			}
		}
	}
}
