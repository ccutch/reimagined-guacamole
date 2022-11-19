package clients

import (
	"context"

	"github.com/google/go-github/v48/github"
	"golang.org/x/oauth2"
)

// NewGithubClient creates a new GithubClient from the given context
func NewGithubClient(ctx context.Context, token string) *github.Client {
	// ts := oauth2.StaticTokenSource(&oauth2.Token{AccessToken: token})
	return github.NewClient(oauth2.NewClient(ctx, nil))
}

// GetIssuesForRepo gets all the issues in a repo
func GetIssuesForRepo(ctx context.Context, owner, repo string) ([]*github.Issue, error) {
	client := ctx.Value(client("github")).(*github.Client)
	issues, _, err := client.Issues.ListByRepo(ctx, owner, repo, nil)
	return issues, err
}
