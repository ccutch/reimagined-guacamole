package clients

import (
	"context"
	"fmt"
	"net/http"
	"strconv"
	"strings"
)

// client type alias for string to avoid collections as
// context value
type client string

// injectClients is a middleware for injecting Github and Bleve clients
func Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		ctx = context.WithValue(ctx, client("github"), NewGithubClient(ctx, r.Header.Get("X-GITHUB-TOKEN")))
		ctx = context.WithValue(ctx, client("search"), AttachBleveClient())
		ctx = context.WithValue(ctx, client("redis"), NewRedisClient(ctx))

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func formatKey(owner, repo string, number int) string {
	return fmt.Sprintf("%s:%s:%d", owner, repo, number)
}

func parseKey(key string) (string, string, int) {
	fmt.Println("Key = ", key)
	parts := strings.Split(key, ":")
	owner := parts[0]
	repo := parts[1]
	number, _ := strconv.Atoi(parts[2])
	return owner, repo, number
}
