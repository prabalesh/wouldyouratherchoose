package main

import (
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/joho/godotenv"

	"github.com/prabalesh/wouldyouratherchoose/backend/db"
	"github.com/prabalesh/wouldyouratherchoose/backend/internal/model"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	_ = godotenv.Load()
	db.InitMongo()

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{os.Getenv("FRONTEND_ORIGIN")},
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		AllowCredentials: true,
	}))

	r.GET("/questions", getQuestions)
	r.POST("/questions", createQuestion)
	r.POST("/vote", submitVote)

	r.Run(":8080")
}

func getUserIdentifiers(c *gin.Context) (ip string, session string) {
	ip = c.ClientIP()
	session, err := c.Cookie("session_id")
	if err != nil {
		session = uuid.New().String()
		c.SetCookie("session_id", session, 3600*24*30, "/", "", false, true)
	}
	return
}

func getQuestions(c *gin.Context) {
	ip, session := getUserIdentifiers(c)

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

func createQuestion(c *gin.Context) {
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

func submitVote(c *gin.Context) {
	var req struct {
		QuestionID string `json:"questionId"`
		Option     string `json:"option"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ip, session := getUserIdentifiers(c)

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
