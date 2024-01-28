package main

import (
	"fmt"
	"log"
	"podlogger/routers"
)

func main() {

	fmt.Println("✅ API Started")
	r := routers.Router()
	
	fmt.Println("🔒 Env loaded")

	fmt.Println("🚚 Starting server")

	log.Fatal(r.Run("localhost:8080"))
}
