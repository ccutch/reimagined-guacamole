package clients

import (
	"context"
	"fmt"
	"strings"

	"github.com/blevesearch/bleve/v2"
	"github.com/google/go-github/github"
)

type GithubIssueIndex struct {
	Owner, Repo string
	ID          int
	Title       string
	Body        string
}

var index bleve.Index

func init() {
	var err error
	index, err = bleve.New("issues.bleve", bleve.NewIndexMapping())
	if err != nil {
		index, err = bleve.Open("issues.bleve")
	}
	if err != nil {
		fmt.Println("index", index)
		panic(err)
	}
}

func AttachBleveClient() bleve.Index {
	return index
}

func IndexIssues(ctx context.Context, owner, repo string, issue *github.Issue) error {
	key := formatKey(owner, repo, *issue.Number)
	if err := StoreIssueInRedis(ctx, key, issue); err != nil {
		return err
	}
	return index.Index(key, &GithubIssueIndex{
		ID:    *issue.Number,
		Owner: owner,
		Repo:  repo,
		Title: *issue.Title,
		Body:  *issue.Body,
	})
}

func SearchIssues(ctx context.Context, owner, repo, query string) (map[string]*github.Issue, error) {
	var issues = map[string]*github.Issue{}
	search := bleve.NewSearchRequest(bleve.NewMatchQuery(query))
	results, err := index.Search(search)
	if err != nil {
		return issues, err
	}
	for _, hit := range results.Hits {
		var issue *github.Issue
		if !strings.HasPrefix(hit.ID, fmt.Sprintf("%s:%s", owner, repo)) {
			continue
		}
		issue, err = GetIssue(ctx, hit.ID)
		if err != nil {
			break
		}
		issues[formatKey(owner, repo, *issue.Number)] = issue
		// issues = append(issues, issue)
	}
	return issues, err
}
