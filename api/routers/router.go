package routers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	controller "podlogger/controllers"
)

func Router() *gin.Engine {
	router := gin.Default()
	fmt.Println("🎉 Server started")
	router.GET("/api/logs", controller.GetLogs)
	router.GET("/api/env", controller.GetEnv)
	router.GET("/api/status", controller.GetStatus)
	router.GET("/", controller.Hello)

	return router
}
