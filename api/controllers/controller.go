package contollers

import (
	"fmt"
	"net/http"
	"os/exec"

	"github.com/gin-gonic/gin"
)

func getLogs() string {
	cmd := exec.Command("ls", "./")
	// cmd:= exec.Command("kubectl", "logs", "-l", "app=nginx", "-n", "default")
	// cmd:= exec.Command("tail", "-F", "/opt/logs.txt")
	out, err := cmd.Output()
	if err != nil {
		fmt.Println("could not run command: ", err)
	} else {
		fmt.Println("Output: \n", string(out))
	}
	output := string(out)
	return output
}

func GetLogs(g *gin.Context) {
	output := getLogs()
	g.IndentedJSON(http.StatusOK, gin.H{
		"output": output,
	})
}

func GetHealth(g *gin.Context) {
	g.IndentedJSON(http.StatusOK, gin.H{
		"status": "OK",
		"message": "Hello",
	})
}