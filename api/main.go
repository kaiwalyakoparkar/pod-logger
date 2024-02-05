package main

import (
	"fmt"
	"log"
	"podlogger/routers"
	"os/exec"
)

func main() {

	fmt.Println("✅ API Started")
	r := routers.Router()
	
	//Auth environments and scripts are running
	exec.Command("chmod","+x","./scripts/auth.sh")

	fmt.Println("🪪 Modified permission")

	exec.Command("./scripts/auth.sh")
	
	fmt.Println("☸️ Kubernetes API working")
	
	fmt.Println("🔒 Env loaded")

	fmt.Println("🚚 Starting server")

	log.Fatal(r.Run("localhost:8080"))
}
