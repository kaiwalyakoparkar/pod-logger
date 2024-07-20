package contollers

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"

	"github.com/gin-gonic/gin"
)

//========================= Functions =========================

func getLogs() string {
	// cmd := exec.Command("ls", "./")
	// cmd:= exec.Command("tail", "-F", "/opt/logs.txt")
	//Place holder command
	// cmd := exec.Command("curl", "http://kubernetes.default.svc/api")

	//cmd := exec.Command("curl", "--cacert", "${CACERT}", "--header", "Authorization: Bearer ${TOKEN}", "${APISERVER}/api")

	cacert := os.Getenv("CACERT")
	fmt.Println(cacert)
	tokenPath := os.Getenv("TOKEN")
	fmt.Println(tokenPath)
	apiserver := os.Getenv("APISERVER")
	fmt.Println(apiserver)
	tokenFile, err := os.Open(tokenPath)
	if err != nil {
		fmt.Println("could not open token file: ", err)
		return "Error Occured\n"
	}
	tokenData, err := io.ReadAll(tokenFile)
	if err != nil {
		fmt.Println("could not read token file: ", err)
		return "Error Occured\n"
	}
	// output := string(out)
	cmd := exec.Command("curl", "--cacert", cacert, "--header", "Authorization: Bearer "+string(tokenData), apiserver+"/api")


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

	// cmd := exec.Command("curl", "--cacert", "${CACERT}", "--header", "Authorization: Bearer ${TOKEN}", "${APISERVER}/api/v1/namespaces/default/pods/ ")

	smt := exec.Command("chmod","+x","../scripts/auth.sh")
	cmd := exec.Command("../scripts/auth.sh")

	out,err := cmd.Output()
	if err != nil {
		fmt.Println("could not run command: ", err)
		fmt.Println(smt)
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