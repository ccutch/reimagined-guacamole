package clients

import (
	"context"
	"fmt"

	"github.com/google/go-github/github"
)

func GetIssue(ctx context.Context, key string) (*github.Issue, error) {
	// 1. Check Redis
	issue, err := GetIssueInRedis(ctx, key)
	// If key does not exist in Redis
	if err != nil {
		// 2. Get issue directly from Github
		issue, err = GetIssueFromGithub(ctx, key)
		if err != nil {
			return nil, err
		}
		// 3. Store issue data in Redis
		err = StoreIssueInRedis(ctx, key, issue)
		if err != nil {
			return nil, err
		}
	}
	return issue, err
}

func RefreshRepo(ctx context.Context, owner, repo string) error {
	return RemoveAllFromRedis(ctx, fmt.Sprintf("%s:%s", owner, repo))
}
