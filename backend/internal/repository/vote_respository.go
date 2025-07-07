package repository

import (
	"github.com/prabalesh/wouldyouratherchoose/backend/internal/db"
	"github.com/prabalesh/wouldyouratherchoose/backend/internal/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type VoteRepository struct{}

func NewVoteRepository() *VoteRepository {
	return &VoteRepository{}
}

func (r *VoteRepository) HasUserVoted(questionID, sessionID string) (bool, error) {
	res := db.VoteCollection.FindOne(db.Ctx, bson.M{
		"questionId": questionID,
		"sessionId":  sessionID,
	})
	if res.Err() == mongo.ErrNoDocuments {
		return false, nil
	}
	if res.Err() != nil {
		return false, res.Err()
	}
	return true, nil
}

func (r *VoteRepository) IncrementVote(questionID, option string) (int64, error) {
	filter := bson.M{"_id": questionID}
	update := bson.M{}

	switch option {
	case "A":
		update = bson.M{"$inc": bson.M{"votesA": 1}}
	case "B":
		update = bson.M{"$inc": bson.M{"votesB": 1}}
	default:
		return 0, nil
	}

	res, err := db.Collection.UpdateOne(db.Ctx, filter, update)
	if err != nil {
		return 0, err
	}
	return res.MatchedCount, nil
}

func (r *VoteRepository) RecordVote(vote model.Vote) error {
	_, err := db.VoteCollection.InsertOne(db.Ctx, vote)
	return err
}

func (r *VoteRepository) GetQuestionByID(questionID string) (*model.Question, error) {
	var q model.Question
	err := db.Collection.FindOne(db.Ctx, bson.M{"_id": questionID}).Decode(&q)
	if err != nil {
		return nil, err
	}
	return &q, nil
}
