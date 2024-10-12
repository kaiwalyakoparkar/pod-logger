package contollers

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"encoding/json"

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

func listPods() string {
	cacert := os.Getenv("CACERT")
	tokenPath := os.Getenv("TOKEN")
	apiserver := os.Getenv("APISERVER")
	ns := os.Getenv("NS")

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

func listNamespaces() []byte {
	cacert := os.Getenv("CACERT")
	tokenPath := os.Getenv("TOKEN")
	apiserver := os.Getenv("APISERVER")

	tokenFile, err := os.Open(tokenPath)

	if err != nil {
		fmt.Println("could not open token file: ", err)
		return jsonError("Error Occured", err)
	}

	token, err := io.ReadAll(tokenFile)
	if err != nil {
		fmt.Println("could not read token file: ", err)
		return jsonError("Error Occured", err)
	}

	cmd := exec.Command("curl", "--cacert", cacert, "--header", "Authorization: Bearer "+string(token), apiserver+"/api/v1/namespaces")

	out, err := cmd.Output()
	
	if err != nil {
		fmt.Println("could not run command: ", err)
	} else {
		fmt.Println("Output: \n", string(out))
	}

	if !isValidJSON(out) {
		return jsonError("Invalid JSON response from API", nil)
	}
	
	// output := string(out)
	output := out
	return output
}

//========================= Error Handling =========================

// Helper function to return error as JSON
func jsonError(message string, err error) []byte {
	errorResponse := map[string]string{"error": message}
	if err != nil {
		errorResponse["details"] = err.Error()
	}
	jsonErr, _ := json.Marshal(errorResponse)
	return jsonErr
}

// Helper function to check if the output is valid JSON
func isValidJSON(data []byte) bool {
	var js json.RawMessage
	return json.Unmarshal(data, &js) == nil
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
	output := listPods()
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