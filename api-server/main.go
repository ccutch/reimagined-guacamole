package main

import (
	"net/http"

	"github.com/gorilla/mux"
	"made-by-connor.com/issues/clients"
	"made-by-connor.com/issues/routes"
)

func main() {
	r := mux.NewRouter()
	r.Use(clients.Middleware)
	r.HandleFunc("/{owner}/{repo}/issues", routes.GetIssues)
	r.HandleFunc("/{owner}/{repo}/refresh", routes.RefreshIssues)
	r.HandleFunc("/batch", routes.GetBatch)
	http.ListenAndServe(":4000", r)
}
