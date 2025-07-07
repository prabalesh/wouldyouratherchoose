package db

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	Client         *mongo.Client
	Collection     *mongo.Collection
	VoteCollection *mongo.Collection
	Ctx            = context.Background()
)

func InitMongo() {
	_ = godotenv.Load()

	mongoURI := os.Getenv("MONGO_URI")
	dbName := os.Getenv("DB_NAME")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	clientOpts := options.Client().ApplyURI(mongoURI)
	client, err := mongo.Connect(ctx, clientOpts)
	if err != nil {
		log.Fatal("MongoDB connection error:", err)
	}

	Client = client
	Collection = client.Database(dbName).Collection("questions")
	VoteCollection = client.Database(dbName).Collection("votes")
}
