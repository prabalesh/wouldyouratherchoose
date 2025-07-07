package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/prabalesh/wouldyouratherchoose/backend/internal/db"
	"github.com/prabalesh/wouldyouratherchoose/backend/internal/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type QuestionHandler struct{}

func NewQuestionHandler() *QuestionHandler {
	return &QuestionHandler{}
}

func (h *QuestionHandler) GetQuestions(c *gin.Context) {
	ip, session := GetUserIdentifiers(c)

	// Fetch voted question IDs
	cursor, _ := db.VoteCollection.Find(db.Ctx, bson.M{"$or": []bson.M{
		{"ip": ip},
		{"sessionId": session},
	}})
	var votes []model.Vote
	_ = cursor.All(db.Ctx, &votes)
	votedMap := make(map[string]bool)
	for _, v := range votes {
		votedMap[v.QuestionID] = true
	}

	// Build filter to exclude already answered
	filter := bson.M{}
	if len(votedMap) > 0 {
		excluded := make([]string, 0, len(votedMap))
		for id := range votedMap {
			excluded = append(excluded, id)
		}
		filter["_id"] = bson.M{"$nin": excluded}
	}

	opts := options.Find().SetLimit(15)
	cur, err := db.Collection.Find(db.Ctx, filter, opts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch questions"})
		return
	}
	defer cur.Close(db.Ctx)

	var questions []model.Question
	if err := cur.All(db.Ctx, &questions); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Decoding error"})
		return
	}

	c.JSON(http.StatusOK, questions)
}

func (h *QuestionHandler) CreateQuestion(c *gin.Context) {
	var q model.Question
	if err := c.ShouldBindJSON(&q); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	q.ID = uuid.New().String()
	q.VotesA = 0
	q.VotesB = 0

	_, err := db.Collection.InsertOne(db.Ctx, q)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert question"})
		return
	}

	c.JSON(http.StatusOK, q)
}
