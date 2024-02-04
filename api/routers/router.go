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

	//Inline function for the same thing above
	// router.GET("/api/logs", func(c *gin.Context) {
	// 	c.JSON(
	// 	  	http.StatusOK,
	// 	  	gin.H{
	// 			"title": "Home Page",
	// 	  	},
	// 	)
	// })

	return router
}
