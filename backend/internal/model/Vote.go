package model

import "time"

type Vote struct {
	QuestionID string    `bson:"questionId"`
	IP         string    `bson:"ip"`
	SessionID  string    `bson:"sessionId"`
	VotedAt    time.Time `bson:"votedAt"`
}
