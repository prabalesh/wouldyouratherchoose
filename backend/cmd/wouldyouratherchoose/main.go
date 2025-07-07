package main

import (
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"github.com/prabalesh/wouldyouratherchoose/backend/internal/db"
	"github.com/prabalesh/wouldyouratherchoose/backend/internal/handler"
	"github.com/prabalesh/wouldyouratherchoose/backend/internal/middleware"
)

func main() {
	_ = godotenv.Load()
	db.InitMongo()

	r := gin.Default()

	r.Use(middleware.GetCorsMiddleware())

	questionHandler := handler.NewQuestionHandler()
	voteHandler := handler.NewVoteHandler()

	r.GET("/questions", questionHandler.GetQuestions)
	r.POST("/questions", questionHandler.CreateQuestion)
	r.POST("/vote", voteHandler.SubmitVote)

	r.Run(":8080")
}
