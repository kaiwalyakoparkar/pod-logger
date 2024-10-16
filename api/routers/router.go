package routers

import (
	"fmt"
	controller "podlogger/controllers"
	"time"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func Router() *gin.Engine {
	router := gin.Default()
	
	//Configure CORS to allow all origins
	config := cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: false,
		MaxAge:           12 * time.Hour,
	}

	router.Use(cors.New(config))

	// router.Use(cors.Default())

	fmt.Println("🎉 Server started")
	router.GET("/api/logs", controller.GetLogs)
	router.GET("/api/listPods", controller.ListPods)
	router.GET("/api/listNs", controller.ListNamespaces)
	router.GET("/api/env", controller.GetEnv)
	router.GET("/api/status", controller.GetStatus)
	router.GET("/", controller.Hello)

	return router
}
