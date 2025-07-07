package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/prabalesh/wouldyouratherchoose/backend/internal/dto"
	"github.com/prabalesh/wouldyouratherchoose/backend/internal/service"
)

type VoteHandler struct {
	voteService *service.VoteService
}

func NewVoteHandler(voteService *service.VoteService) *VoteHandler {
	return &VoteHandler{voteService: voteService}
}

func (h *VoteHandler) SubmitVote(c *gin.Context) {
	var body dto.SumbitVoteRequestDto
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ip, session := GetUserIdentifiers(c)

	question, err := h.voteService.SubmitVote(body.QuestionID, body.Option, ip, session)
	if err != nil {
		switch err.Error() {
		case "already voted":
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		case "invalid option":
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		case "question not found":
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, question)
}
