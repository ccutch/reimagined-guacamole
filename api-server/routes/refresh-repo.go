package routes

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"made-by-connor.com/issues/clients"
)

func RefreshIssues(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	owner, repo := vars["owner"], vars["repo"]
	err := clients.RefreshRepo(r.Context(), owner, repo)
	if err != nil {
		fmt.Println("Error", err)
		w.WriteHeader(500)
		json.NewEncoder(w).Encode(err)
		return
	}
	GetIssues(w, r)
}
