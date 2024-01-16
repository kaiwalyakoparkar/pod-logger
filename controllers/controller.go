package contollers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"fmt"
	"os/exec"
)

func getLogs() string{
	// cmd := exec.Command("ls", "./")
	cmd:= exec.Command("kubectl", "logs", "-l", "app=nginx", "-n", "default")
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