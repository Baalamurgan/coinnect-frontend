package db

import "github.com/Baalamurgan/coin-selling-backend/pkg/auth"

var (
	AuthSvc auth.Service = nil
)

func InitServices() {
	db := GetDB()

	authRepo := auth.NewPostgresRepo(db)
	AuthSvc = auth.NewService(authRepo)
}
