package model

type Question struct {
	ID       string `json:"id" bson:"_id"`
	Question string `json:"question"`
	OptionA  string `json:"optionA"`
	OptionB  string `json:"optionB"`
	VotesA   int    `json:"votesA"`
	VotesB   int    `json:"votesB"`
}
