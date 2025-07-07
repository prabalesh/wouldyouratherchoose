package main

import (
	"context"
	"encoding/json"
	"log"
	"os"

	"github.com/google/uuid"
	"github.com/prabalesh/wouldyouratherchoose/backend/internal/db"
)

type Question struct {
	ID       string `bson:"_id"`
	Question string `json:"question"`
	OptionA  string `json:"optionA"`
	OptionB  string `json:"optionB"`
	VotesA   int    `bson:"votesA"`
	VotesB   int    `bson:"votesB"`
}

func main() {
	db.InitMongo()

	// Read JSON file
	file, err := os.Open("./seed/questions.json")
	if err != nil {
		log.Fatalf("❌ Failed to open JSON file: %v", err)
	}
	defer file.Close()

	var questions []Question
	if err := json.NewDecoder(file).Decode(&questions); err != nil {
		log.Fatalf("❌ Failed to decode JSON: %v", err)
	}

	// Set IDs and votes, insert into DB
	for _, q := range questions {
		q.ID = uuid.New().String()
		q.VotesA = 0
		q.VotesB = 0

		_, err := db.Collection.InsertOne(context.Background(), q)
		if err != nil {
			log.Printf("❌ Failed to insert question: %v\n", err)
		}
	}

	log.Println("✅ Seeded all questions from JSON successfully.")
}
