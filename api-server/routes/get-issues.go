package routes

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"made-by-connor.com/issues/clients"
)

// GetIssues first checks redis for a previous query, then if none exist
// fetches issues from Github and caches response.
func GetIssues(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	vars := mux.Vars(r)
	query := r.URL.Query().Get("query")
	owner, repo := vars["owner"], vars["repo"]

	// Case when there is no search we use github api to get issues
	if query == "" {
		issues, err := clients.GetIssuesForRepo(ctx, owner, repo)
		if err != nil {
			fmt.Println("Error1", err)
			w.WriteHeader(500)
			json.NewEncoder(w).Encode(err)
			return
		}

		for _, issue := range issues {
			clients.IndexIssues(ctx, owner, repo, issue)
		}
		json.NewEncoder(w).Encode(issues)
		return
	}

	// Otherwise we are going to search with the query param
	issues, err := clients.SearchIssues(ctx, owner, repo, query)
	if err != nil {
		fmt.Println("Error2", err)
		w.WriteHeader(500)
		json.NewEncoder(w).Encode(err)
		return
	}

	fmt.Println("ISsues", issues)
	json.NewEncoder(w).Encode(issues)
}
