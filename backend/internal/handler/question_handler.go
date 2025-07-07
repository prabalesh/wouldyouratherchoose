package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/prabalesh/wouldyouratherchoose/backend/internal/model"
	"github.com/prabalesh/wouldyouratherchoose/backend/internal/service"
)

type QuestionHandler struct {
	questionService *service.QuestionService
}

func NewQuestionHandler(service *service.QuestionService) *QuestionHandler {
	return &QuestionHandler{questionService: service}
}

func (h *QuestionHandler) GetQuestions(c *gin.Context) {
	ip, session := GetUserIdentifiers(c)

	questions, err := h.questionService.GetQuestions(ip, session)

	if err != nil {
		switch err.Error() {
		case "failed to fetch questions":
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch questions"})
		case "internal server error":
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "An unexpected error occurred"})
		}

	}
	c.JSON(http.StatusOK, questions)
}

func (h *QuestionHandler) CreateQuestion(c *gin.Context) {
	var question model.Question

	if err := c.ShouldBindJSON(&question); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.questionService.CreateQuestion(&question)

	if err != nil {
		switch err.Error() {
		case "failed to create question":
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create question"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "An unexpected error occurred"})
		}
		return
	}

	c.JSON(http.StatusOK, question)
}
