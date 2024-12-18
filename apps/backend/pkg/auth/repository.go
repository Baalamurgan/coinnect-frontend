package auth

import (
	"github.com/Baalamurgan/coin-selling-backend/api/schemas"
)

type Repository interface {
	CreateUser(data *schemas.CreateUserDetails) error
}
