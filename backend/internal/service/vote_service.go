package service

import (
	"errors"
	"time"

	"github.com/prabalesh/wouldyouratherchoose/backend/internal/model"
	"github.com/prabalesh/wouldyouratherchoose/backend/internal/repository"
)

type VoteService struct {
	voteRepo *repository.VoteRepository
}

func NewVoteService(voteRepo *repository.VoteRepository) *VoteService {
	return &VoteService{voteRepo: voteRepo}
}

func (s *VoteService) SubmitVote(questionID, option, ip, session string) (*model.Question, error) {
	// Check if already voted
	voted, err := s.voteRepo.HasUserVoted(questionID, session)
	if err != nil {
		return nil, err
	}
	if voted {
		return nil, errors.New("already voted")
	}

	// Validate option
	if option != "A" && option != "B" {
		return nil, errors.New("invalid option")
	}

	// Increment vote
	updatedCount, err := s.voteRepo.IncrementVote(questionID, option)
	if err != nil {
		return nil, err
	}
	if updatedCount == 0 {
		return nil, errors.New("question not found")
	}

	// Record vote
	err = s.voteRepo.RecordVote(model.Vote{
		QuestionID: questionID,
		IP:         ip,
		SessionID:  session,
		VotedAt:    time.Now(),
	})
	if err != nil {
		return nil, err
	}

	// Get updated question
	question, err := s.voteRepo.GetQuestionByID(questionID)
	if err != nil {
		return nil, err
	}

	return question, nil
}
