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
	tokenPath := os.Getenv("TOKEN")
	apiserver := os.Getenv("APISERVER")
	pn := os.Getenv("PN")

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

	cmd := exec.Command("curl", "--cacert", cacert, "--header", "Authorization: Bearer "+string(token), apiserver+"/api/v1/namespaces/default/pods/"+pn+"/log")

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
	tokenPath := os.Getenv("TOKEN")
	apiserver := os.Getenv("APISERVER")

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

	cmd := exec.Command("curl", "--cacert", cacert, "--header", "Authorization: Bearer "+string(token), apiserver+"/api/v1/namespaces/default/pods")

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

func listPods(pod *gin.Context) string {
	cacert := os.Getenv("CACERT")
	tokenPath := os.Getenv("TOKEN")
	apiserver := os.Getenv("APISERVER")
	ns := pod.Query("namespace")

	fmt.Println("Namespace: ", ns)

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

	cmd := exec.Command("curl", "--cacert", cacert, "--header", "Authorization: Bearer "+string(token), apiserver+"/api/v1/namespaces/"+ns+"/pods")

	out, err := cmd.Output()
	
	if err != nil {
		fmt.Println("could not run command: ", err)
	} else {
		fmt.Println("Output: \n", string(out))
	}
	output := string(out)
	return output
}


func listNamespaces() string {
	cacert := os.Getenv("CACERT")
	tokenPath := os.Getenv("TOKEN")
	apiserver := os.Getenv("APISERVER")

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

	cmd := exec.Command("curl", "--cacert", cacert, "--header", "Authorization: Bearer "+string(token), apiserver+"/api/v1/namespaces")

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

func ListPods(g *gin.Context) {
	output := listPods(g)
	g.IndentedJSON(http.StatusOK, gin.H{
		"env": output,
	})
}

func ListNamespaces(g *gin.Context) {
	output := listNamespaces()
	g.IndentedJSON(http.StatusOK, gin.H{
		"env": output,
	})
}

func Hello(g *gin.Context) {
	g.IndentedJSON(http.StatusOK, gin.H{
		"message": "Hello from Podlogger API",
	})
}