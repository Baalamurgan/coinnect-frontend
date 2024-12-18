package auth

import "github.com/Baalamurgan/coin-selling-backend/api/schemas"

type Service interface {
	CreateUser(data *schemas.CreateUserDetails) error
}

func (a *authSvc) CreateUser(data *schemas.CreateUserDetails) error {
	return a.repo.CreateUser(data)
}

type authSvc struct {
	repo Repository
}

func NewService(r Repository) Service {
	return &authSvc{
		repo: r,
	}
}
