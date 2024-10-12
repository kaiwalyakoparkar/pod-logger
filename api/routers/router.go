package routers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	controller "podlogger/controllers"
)

func Router() *gin.Engine {
	router := gin.Default()
	router.Use(cors.Default())

	fmt.Println("🎉 Server started")
	router.GET("/api/logs", controller.GetLogs)
	router.GET("/api/listPods", controller.ListPods)
	router.GET("/api/listNs", controller.ListNamespaces)
	router.GET("/api/env", controller.GetEnv)
	router.GET("/api/status", controller.GetStatus)
	router.GET("/", controller.Hello)

	return router
}
