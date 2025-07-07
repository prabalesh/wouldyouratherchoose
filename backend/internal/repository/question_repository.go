package repository

import (
	"github.com/prabalesh/wouldyouratherchoose/backend/internal/db"
	"github.com/prabalesh/wouldyouratherchoose/backend/internal/model"
	"go.mongodb.org/mongo-driver/bson"
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
	pipeline := []bson.M{}

	// Exclude already voted questions
	if len(excludeIDs) > 0 {
		pipeline = append(pipeline, bson.M{
			"$match": bson.M{
				"_id": bson.M{"$nin": excludeIDs},
			},
		})
	}

	// Randomly sample documents
	pipeline = append(pipeline, bson.M{
		"$sample": bson.M{"size": limit},
	})

	cursor, err := db.Collection.Aggregate(db.Ctx, pipeline)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(db.Ctx)

	var questions []model.Question
	if err := cursor.All(db.Ctx, &questions); err != nil {
		return nil, err
	}

	return questions, nil
}
