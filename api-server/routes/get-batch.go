package routes

import "net/http"

func GetBatch(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello world"))
}
