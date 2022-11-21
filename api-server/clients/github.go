package clients

import (
	"context"
	"os"

	"github.com/google/go-github/github"
	"golang.org/x/oauth2"
)

// NewGithubClient creates a new GithubClient from the given context
func NewGithubClient(ctx context.Context, token string) *github.Client {
	ts := oauth2.StaticTokenSource(&oauth2.Token{AccessToken: os.Getenv("API_TOKEN")})
	return github.NewClient(oauth2.NewClient(ctx, ts))
}

// GetIssuesForRepo gets all the issues in a repo
func GetIssuesForRepo(ctx context.Context, owner, repo string) (map[string]*github.Issue, error) {
	var issueMap = map[string]*github.Issue{}
	client := ctx.Value(client("github")).(*github.Client)
	issues, _, err := client.Issues.ListByRepo(ctx, owner, repo, nil)
	for _, issue := range issues {
		issueMap[formatKey(owner, repo, *issue.Number)] = issue
	}
	return issueMap, err
}

func GetIssueFromGithub(ctx context.Context, key string) (*github.Issue, error) {
	client := ctx.Value(client("github")).(*github.Client)
	owner, repo, number := parseKey(key)
	issue, _, err := client.Issues.Get(ctx, owner, repo, number)
	return issue, err
}
