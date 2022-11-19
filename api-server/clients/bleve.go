package clients

import (
	"context"
	"fmt"

	"github.com/blevesearch/bleve/v2"
	"github.com/google/go-github/v48/github"
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
	fmt.Println("Issue = ", issue)
	i := GithubIssueIndex{
		ID:    *issue.Number,
		Owner: owner,
		Repo:  repo,
		Title: *issue.Title,
		Body:  *issue.Body,
	}
	return index.Index(fmt.Sprintf("%s:%s:%d", i.Owner, i.Repo, i.ID), i)
}

func SearchIssues(ctx context.Context, owner, repo, query string) (any, error) {
	search := bleve.NewSearchRequest(bleve.NewMatchQuery(query))
	results, err := index.Search(search)
	return results.Hits, err
	// if err != nil {
	// 	return []GithubIssueIndex{}, err
	// }
	// var issues []GithubIssueIndex
	// fmt.Println("Results", results)
	// for _, hit := range results.Hits {
	// 	fmt.Println("Hits", hit)
	// 	issues = append(issues, GithubIssueIndex{
	// 		Owner: hit.Fields["Owner"].(string),
	// 		Repo:  hit.Fields["Repo"].(string),
	// 		ID:    hit.Fields["ID"].(int),
	// 		Title: hit.Fields["Title"].(string),
	// 		Body:  hit.Fields["Body"].(string),
	// 	})
	// }
	// return issues, nil
}
