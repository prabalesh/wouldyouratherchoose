package service

import (
	"errors"

	"github.com/google/uuid"
	"github.com/prabalesh/wouldyouratherchoose/backend/internal/db"
	"github.com/prabalesh/wouldyouratherchoose/backend/internal/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type QuestionService struct{}

func NewQuestionService() *QuestionService {
	return &QuestionService{}
}

func (s *QuestionService) GetQuestions(ip, session string) ([]model.Question, error) {
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
		return nil, errors.New("failed to fetch questions")
	}
	defer cur.Close(db.Ctx)

	var questions []model.Question
	if err := cur.All(db.Ctx, &questions); err != nil {
		return nil, errors.New("internal server error")
	}

	return questions, nil
}

func (s *QuestionService) CreateQuestion(question *model.Question) error {
	question.ID = uuid.New().String()
	question.VotesA = 0
	question.VotesB = 0

	_, err := db.Collection.InsertOne(db.Ctx, question)
	if err != nil {
		return errors.New("failed to insert question")
	}
	return nil
}
