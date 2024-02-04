package contollers

import (
	"fmt"
	"net/http"
	"os/exec"

	"github.com/gin-gonic/gin"
)

//========================= Functions =========================

func getLogs() string {
	// cmd := exec.Command("ls", "./")
	// cmd:= exec.Command("tail", "-F", "/opt/logs.txt")
	//Place holder command
	cmd := exec.Command("curl", "http://kubernetes.default.svc/api")

	out, err := cmd.Output()
	if err != nil {
		fmt.Println("could not run command: ", err)
	} else {
		fmt.Println("Output: \n", string(out))
	}
	output := string(out)
	return output
}

func getStatus() string {
	//This command gives the status of the kubernetes api
	cmd := exec.Command("curl", "http://kubernetes.default.svc/api")
	out,err := cmd.Output()
	if err != nil {
		fmt.Println("could not run command: ", err)
	} else {
		fmt.Println("Output: \n", string(out))
	}
	output := string(out)
	return output
}


func getEnvs() string {
	cmd := exec.Command("env")
	out, err := cmd.Output()
	if err != nil {
		fmt.Println("could not run command: ", err)
		} else {
			fmt.Println("Output: \n", string(out))
		}
		output := string(out)
		return output
	}
	
//========================= Handlers =========================

func GetLogs(g *gin.Context) {
	output := getLogs()
	g.IndentedJSON(http.StatusOK, gin.H{
		"output": output,
	})
}

func GetStatus(g *gin.Context) {
	output := getStatus()
	g.IndentedJSON(http.StatusOK, gin.H{
		"status": output,
	})
}

func GetEnv(g *gin.Context) {
	output := getEnvs()
	g.IndentedJSON(http.StatusOK, gin.H{
		"env": output,
	})
}

func Hello(g *gin.Context) {
	g.IndentedJSON(http.StatusOK, gin.H{
		"message": "Hello from Podlogger API",
	})
}