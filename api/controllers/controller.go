package contollers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"

	"github.com/gin-gonic/gin"
)

//========================= Functions =========================

func getLogs(l *gin.Context) string {

	cacert := os.Getenv("CACERT")
	tokenPath := os.Getenv("TOKEN")
	apiserver := os.Getenv("APISERVER")
	podName := l.Query("pod")
	namespace := l.Query("namespace")
	container := l.Query("container")

	fmt.Println("👷 Getting logs for: ", podName)

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

	cmd := exec.Command("curl", "--cacert", cacert, "--header", "Authorization: Bearer "+string(token), apiserver+"/api/v1/namespaces/"+namespace+"/pods/"+podName+"/log?container="+container+"&timestamps=true")

	out, err := cmd.Output()

	if err != nil {
		fmt.Println("could not run command: ", err)
	} else {
		fmt.Println("🥳 Logs sent successfully")
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
		fmt.Println("🥳 Status sent successfully")
	}
	output := string(out)
	return output
}

// func getEnvs() string {
// 	cmd := exec.Command("env")
// 	out, err := cmd.Output()
// 	if err != nil {
// 		fmt.Println("could not run command: ", err)
// 	} else {
// 		fmt.Println("Env sent successfully")
// 	}
// 		output := string(out)
// 		return output
// }

func listPods(pod *gin.Context) string {
	cacert := os.Getenv("CACERT")
	tokenPath := os.Getenv("TOKEN")
	apiserver := os.Getenv("APISERVER")
	ns := pod.Query("namespace")

	tokenFile, err := os.Open(tokenPath)

	fmt.Println("👷 Getting pods from: ", ns)

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
		fmt.Println("🥳 Pods List sent successfully")
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
		fmt.Println("🥳 Namespace list sent successfully")
	}

	output := string(out)
	return output
}

func listContainer(c *gin.Context) string {

	cacert := os.Getenv("CACERT")
	tokenPath := os.Getenv("TOKEN")
	apiserver := os.Getenv("APISERVER")
	namespace := c.Query("namespace")
	podName := c.Query("pod")

	fmt.Println("👷 Getting containers for: ", podName)

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

	cmd := exec.Command("curl", "--cacert", cacert, "--header", "Authorization: Bearer "+string(token), apiserver+"/api/v1/namespaces/"+namespace+"/pods/"+podName)

	out, err := cmd.Output()
	if err != nil {
		fmt.Println("could not run command: ", err)
		return "Error Occured\n"
	}

	var pod struct {
		Spec struct {
			Containers []struct {
				Name string `json:"name"`
			} `json:"containers"`
		} `json:"spec"`
	}

	err = json.Unmarshal(out, &pod)
	if err != nil {
		fmt.Println("could not run command: ", err)
	} else {
		fmt.Println("🫡 Your container list is getting ready")
	}

	if len(pod.Spec.Containers) > 0 {
		containerNames := make([]string, len(pod.Spec.Containers))
		for i, container := range pod.Spec.Containers {
			containerNames[i] = container.Name
		} 
		containerNamesJSON, err := json.Marshal(containerNames)
		if err != nil {
			fmt.Println("could not run command: ", err)
			return "Error Occured\n"
		}

		fmt.Println("🥳 Container List sent successfully")
		return string(containerNamesJSON)
	} else {
		return "No containers found\n"
	}
}

//========================= Handlers =========================

func GetLogs(g *gin.Context) {
	output := getLogs(g)
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

//This endpoint is testing purpose only to check if the env variables are being read correctly
// func GetEnv(g *gin.Context) {
// 	output := getEnvs()
// 	g.IndentedJSON(http.StatusOK, gin.H{
// 		"env": output,
// 	})
// }

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

func ListContainers(g *gin.Context) {
	output := listContainer(g)
	g.IndentedJSON(http.StatusOK, gin.H{
		"env": output,
	})
}