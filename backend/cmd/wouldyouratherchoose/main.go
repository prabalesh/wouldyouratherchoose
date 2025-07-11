package main

import (
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"github.com/prabalesh/wouldyouratherchoose/backend/internal/db"
	"github.com/prabalesh/wouldyouratherchoose/backend/internal/handler"
	"github.com/prabalesh/wouldyouratherchoose/backend/internal/middleware"
	"github.com/prabalesh/wouldyouratherchoose/backend/internal/repository"
	"github.com/prabalesh/wouldyouratherchoose/backend/internal/service"
)

func main() {
	_ = godotenv.Load()
	db.InitMongo()

	r := gin.Default()

	r.Use(middleware.GetCorsMiddleware())

	voteRepo := repository.NewVoteRepository()
	voteService := service.NewVoteService(voteRepo)
	voteHandler := handler.NewVoteHandler(voteService)

	questionRepo := repository.NewQuestionRepository()
	questionService := service.NewQuestionService(questionRepo, voteRepo)
	questionHandler := handler.NewQuestionHandler(questionService)

	r.GET("/questions", questionHandler.GetQuestions)
	r.POST("/questions", questionHandler.CreateQuestion)
	r.POST("/vote", voteHandler.SubmitVote)

	r.Run(":8080")
}
