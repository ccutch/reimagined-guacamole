package routes

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/google/go-github/github"
	"made-by-connor.com/issues/clients"
)

func GetBatch(w http.ResponseWriter, r *http.Request) {
	var issues = []*github.Issue{}
	var err error

	for _, key := range r.URL.Query()["key"] {
		var issue *github.Issue
		issue, _ = clients.GetIssue(r.Context(), key)
		issues = append(issues, issue)
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
