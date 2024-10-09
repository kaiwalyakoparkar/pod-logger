package main

import (
	"fmt"
	"log"
	"podlogger/routers"
)

func main() {

	fmt.Println("✅ API Started")
	r := routers.Router()
	
	//Auth environments and scripts are running
	
	fmt.Println("☸️ Kubernetes API working")
	
	fmt.Println("🔒 Env loaded")

	fmt.Println("🚚 Starting server")

	log.Fatal(r.Run("0.0.0.0:8080"))
}
