package dto

type SumbitVoteRequestDto struct {
	QuestionID string `json:"questionId"`
	Option     string `json:"option"`
}
