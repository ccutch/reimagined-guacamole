package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/google/go-github/github"
	"github.com/gorilla/mux"
	"made-by-connor.com/issues/clients"
)

// GetIssues first checks redis for a previous query, then if none exist
// fetches issues from Github and caches response.
func GetIssues(w http.ResponseWriter, r *http.Request) {
	var issues map[string]*github.Issue
	var err error
	ctx, query, owner, repo := parseRequest(r)
	if query == "" {
		issues, err = getAllIssues(ctx, owner, repo)
	} else {
		issues, err = clients.SearchIssues(ctx, owner, repo, query)
	}
	if err != nil {
		fmt.Println("Error", err)
		w.WriteHeader(500)
		json.NewEncoder(w).Encode(err)
	} else {
		w.WriteHeader(200)
		json.NewEncoder(w).Encode(issues)
	}
}

func parseRequest(r *http.Request) (context.Context, string, string, string) {
	ctx := r.Context()
	vars := mux.Vars(r)
	query := r.URL.Query().Get("query")
	owner, repo := vars["owner"], vars["repo"]
	return ctx, query, owner, repo
}

func getAllIssues(ctx context.Context, owner, repo string) (map[string]*github.Issue, error) {
	issues, err := clients.GetIssuesForRepo(ctx, owner, repo)
	if err != nil {
		return issues, err
	}
	for _, issue := range issues {
		clients.IndexIssues(ctx, owner, repo, issue)
	}
	return issues, err
}
