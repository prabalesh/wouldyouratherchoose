package handler

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/prabalesh/wouldyouratherchoose/backend/internal/db"
	"github.com/prabalesh/wouldyouratherchoose/backend/internal/model"
	"go.mongodb.org/mongo-driver/bson"
)

type VoteHandler struct{}

func NewVoteHandler() *VoteHandler {
	return &VoteHandler{}
}

func (h *VoteHandler) SubmitVote(c *gin.Context) {
	var req struct {
		QuestionID string `json:"questionId"`
		Option     string `json:"option"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ip, session := GetUserIdentifiers(c)

	// Check if already voted
	exists := db.VoteCollection.FindOne(db.Ctx, bson.M{
		"questionId": req.QuestionID,
		"$or": []bson.M{
			{"ip": ip},
			{"sessionId": session},
		},
	})
	if exists.Err() == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Already voted"})
		return
	}

	// Update vote count
	filter := bson.M{"_id": req.QuestionID}
	update := bson.M{}
	switch req.Option {
	case "A":
		update = bson.M{"$inc": bson.M{"votesA": 1}}
	case "B":
		update = bson.M{"$inc": bson.M{"votesB": 1}}
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid option"})
		return
	}

	res, err := db.Collection.UpdateOne(db.Ctx, filter, update)
	if err != nil || res.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Question not found or update failed"})
		return
	}

	// Record vote
	db.VoteCollection.InsertOne(db.Ctx, model.Vote{
		QuestionID: req.QuestionID,
		IP:         ip,
		SessionID:  session,
		VotedAt:    time.Now(),
	})

	var updated model.Question
	_ = db.Collection.FindOne(db.Ctx, filter).Decode(&updated)
	c.JSON(http.StatusOK, updated)
}
