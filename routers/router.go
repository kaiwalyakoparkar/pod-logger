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
