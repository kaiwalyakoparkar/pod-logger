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

	cacert := os.Getenv("CACERT")
	//fmt.Println(cacert)
	tokenPath := os.Getenv("TOKEN")
	//fmt.Println(tokenPath)
	apiserver := os.Getenv("APISERVER")
	//fmt.Println(apiserver)
	tokenFile, err := os.Open(tokenPath)

	if err != nil {
		fmt.Println("could not open token file: ", err)
		return "Error Occured\n"
	}

	token, err := io.ReadAll(tokenFile)
	if err != nil {
		fmt.Println("could not read token file: ", err)
		return "Error Occured\n"
	}

	cmd := exec.Command("curl", "--cacert", cacert, "--header", "Authorization: Bearer "+string(token), apiserver+"/api")

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
	cacert := os.Getenv("CACERT")
	//fmt.Println(cacert)
	tokenPath := os.Getenv("TOKEN")
	//fmt.Println(tokenPath)
	apiserver := os.Getenv("APISERVER")
	//ns := os.Getenv("NS")
	//fmt.Println(apiserver)
	tokenFile, err := os.Open(tokenPath)

	if err != nil {
		fmt.Println("could not open token file: ", err)
		return "Error Occured\n"
	}

	token, err := io.ReadAll(tokenFile)
	if err != nil {
		fmt.Println("could not read token file: ", err)
		return "Error Occured\n"
	}

	cmd := exec.Command("curl", "--cacert", cacert, "--header", "Authorization: Bearer "+string(token), apiserver+"/api/v1/namespaces/default/pods | jq '.items[].metadata.name'")

	out, err := cmd.Output()
	
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