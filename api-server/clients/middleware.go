package clients

import (
	"context"
	"net/http"
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
		// ctx = context.WithValue(ctx, client("redis"), NewRedisClient(ctx))

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
