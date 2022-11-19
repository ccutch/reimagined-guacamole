package clients

import (
	"bytes"
	"encoding/json"
	"os"
	"time"

	"github.com/go-redis/redis"
	"github.com/google/go-github/github"
	"golang.org/x/net/context"
)

func NewRedisClient(ctx context.Context) *redis.Client {
	hostURL, err := redis.ParseURL(os.Getenv("REDIS_URL"))
	if err != nil {
		panic("Failed Redis: " + err.Error())
	}
	return redis.NewClient(hostURL)
}

func StoreIssueInRedis(ctx context.Context, key string, issue *github.Issue) error {
	client := ctx.Value(client("redis")).(*redis.Client)
	var buffer bytes.Buffer
	err := json.NewEncoder(&buffer).Encode(issue)
	if err != nil {
		return err
	}
	resp := client.Set(key, buffer.String(), time.Minute*300)
	return resp.Err()
}

func GetIssueInRedis(ctx context.Context, id string) (*github.Issue, error) {
	client := ctx.Value(client("redis")).(*redis.Client)
	var buffer string
	var issue github.Issue
	err := client.Get(id).Scan(&buffer)
	if err != nil {
		return nil, err
	}
	err = json.Unmarshal([]byte(buffer), &issue)
	return &issue, err
}
