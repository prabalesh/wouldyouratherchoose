package service

import (
	"errors"

	"github.com/google/uuid"
	"github.com/prabalesh/wouldyouratherchoose/backend/internal/model"
	"github.com/prabalesh/wouldyouratherchoose/backend/internal/repository"
)

type QuestionService struct {
	questionRepo *repository.QuestionRepository
	voteRepo     *repository.VoteRepository
}

func NewQuestionService(qr *repository.QuestionRepository, vr *repository.VoteRepository) *QuestionService {
	return &QuestionService{
		questionRepo: qr,
		voteRepo:     vr,
	}
}

func (s *QuestionService) GetQuestions(ip, session string) ([]model.Question, error) {
	votes, err := s.voteRepo.GetVotesByUser(ip, session)
	if err != nil {
		return nil, errors.New("internal server error")
	}

	// Build list of voted question IDs
	votedMap := make(map[string]bool)
	for _, v := range votes {
		votedMap[v.QuestionID] = true
	}
	excluded := make([]string, 0, len(votedMap))
	for id := range votedMap {
		excluded = append(excluded, id)
	}

	// Fetch questions user hasn't voted on
	questions, err := s.questionRepo.GetUnansweredQuestions(excluded, 15)
	if err != nil {
		return nil, errors.New("failed to fetch questions")
	}

	return questions, nil
}

func (s *QuestionService) CreateQuestion(question *model.Question) error {
	question.ID = uuid.New().String()
	question.VotesA = 0
	question.VotesB = 0

	err := s.questionRepo.InsertQuestion(question)
	if err != nil {
		return errors.New("failed to insert question")
	}
	return nil
}
