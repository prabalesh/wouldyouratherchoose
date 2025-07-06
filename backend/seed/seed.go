package main

import (
	"context"
	"log"

	"github.com/google/uuid"
	"github.com/prabalesh/wouldyouratherchoose/backend/db"
)

type Question struct {
	ID       string `bson:"_id"`
	Question string
	OptionA  string
	OptionB  string
	VotesA   int
	VotesB   int
}

func main() {
	db.InitMongo()

	questions := []Question{
		{ID: uuid.New().String(), Question: "Would you rather kill someone and get away, or torture till death and get away?", OptionA: "Kill someone", OptionB: "Torture till death"},
		{ID: uuid.New().String(), Question: "Would you rather have tea or coffee on a rainy day?", OptionA: "Tea", OptionB: "Coffee"},
		{ID: uuid.New().String(), Question: "Would you rather dance or sing?", OptionA: "Dance", OptionB: "Sing"},
		{ID: uuid.New().String(), Question: "Would you rather go to a beach or a park?", OptionA: "Beach", OptionB: "Park"},
		{ID: uuid.New().String(), Question: "Would you rather fk a guy or stay single whole life?", OptionA: "Fk a guy", OptionB: "Stay single"},
		{ID: uuid.New().String(), Question: "Would you rather have 4 kids or have no kids?", OptionA: "4 kids", OptionB: "No kids"},
		{ID: uuid.New().String(), Question: "Would you rather wear a skirt or be naked?", OptionA: "Skirt", OptionB: "Be naked"},
		{ID: uuid.New().String(), Question: "Lipstick or eyeliner?", OptionA: "Lipstick", OptionB: "Eyeliner"},
		{ID: uuid.New().String(), Question: "Muscles or thick booty?", OptionA: "Muscles", OptionB: "Thick booty"},
		{ID: uuid.New().String(), Question: "Long hair or no hair?", OptionA: "Long hair", OptionB: "No hair"},
		{ID: uuid.New().String(), Question: "DC or Marvel?", OptionA: "DC", OptionB: "Marvel"},
		{ID: uuid.New().String(), Question: "2 daughters or 2 sons?", OptionA: "2 daughters", OptionB: "2 sons"},
		{ID: uuid.New().String(), Question: "Shorts or pants?", OptionA: "Shorts", OptionB: "Pants"},
		{ID: uuid.New().String(), Question: "Flirting or fking?", OptionA: "Flirting", OptionB: "Fking"},
		{ID: uuid.New().String(), Question: "Puppy or kitten?", OptionA: "Puppy", OptionB: "Kitten"},
		{ID: uuid.New().String(), Question: "Bad breath or fart?", OptionA: "Bad breath", OptionB: "Fart"},
	}

	for _, q := range questions {
		q.VotesA = 0
		q.VotesB = 0

		_, err := db.Collection.InsertOne(context.Background(), q)
		if err != nil {
			log.Printf("❌ Failed to insert question: %v\n", err)
		}
	}

	log.Println("✅ Seeded all questions successfully.")
}
