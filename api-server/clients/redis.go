package clients

import (
	"bytes"
	"encoding/json"
	"fmt"
	"time"

	"github.com/go-redis/redis"
	"github.com/google/go-github/v48/github"
	"golang.org/x/net/context"
)

func NewRedisClient(ctx context.Context) *redis.Client {
	return redis.NewClient(&redis.Options{})
}

func StoreIssues(ctx context.Context, owner, repo string, issues []*github.Issue) error {
	client := ctx.Value(client("redis")).(*redis.Client)
	var buffer bytes.Buffer
	json.NewEncoder(&buffer).Encode(issues)
	resp := client.Set(fmt.Sprintf("%s:%s", owner, repo), buffer.String(), time.Minute*300)
	return resp.Err()
}
