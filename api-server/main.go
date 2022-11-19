package main

import (
	"fmt"
	"net/http"
	"os"
	"strconv"

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
	http.ListenAndServe(addr(), r)
}

func addr() string {
	port, err := strconv.Atoi(os.Getenv("PORT"))
	if err != nil {
		port = 4000
	}
	return fmt.Sprintf("0.0.0.0:%d", port)
}
