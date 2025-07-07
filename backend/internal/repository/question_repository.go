package repository

import (
	"github.com/prabalesh/wouldyouratherchoose/backend/internal/db"
	"github.com/prabalesh/wouldyouratherchoose/backend/internal/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type QuestionRepository struct{}

func NewQuestionRepository() *QuestionRepository {
	return &QuestionRepository{}
}

func (r *QuestionRepository) InsertQuestion(q *model.Question) error {
	_, err := db.Collection.InsertOne(db.Ctx, q)
	return err
}

func (r *QuestionRepository) GetUnansweredQuestions(excludeIDs []string, limit int64) ([]model.Question, error) {
	filter := bson.M{}
	if len(excludeIDs) > 0 {
		filter["_id"] = bson.M{"$nin": excludeIDs}
	}
	opts := options.Find().SetLimit(limit)

	cur, err := db.Collection.Find(db.Ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	defer cur.Close(db.Ctx)

	var questions []model.Question
	if err := cur.All(db.Ctx, &questions); err != nil {
		return nil, err
	}

	return questions, nil
}
