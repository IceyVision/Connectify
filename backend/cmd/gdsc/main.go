package main 

import (
	"fmt"
	"gdsc/pkg/websocket"
	
	
)


func main(){
	fmt.Println("Starting Websocket server...")
	go websocket.StartServer()
	
	select {}
	
	
	
}