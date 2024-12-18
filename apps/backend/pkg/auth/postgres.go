package auth

import (
	"github.com/Baalamurgan/coin-selling-backend/api/schemas"
	"github.com/Baalamurgan/coin-selling-backend/pkg/models"
	"gorm.io/gorm"
)

func (r *repo) CreateUser(data *schemas.CreateUserDetails) error {
	return r.DB.Model(&models.User{}).Create(&models.User{
		Username: data.Username,
		Email:    data.Email,
		Password: data.Password,
	}).Error
}

type repo struct {
	DB *gorm.DB
}

func NewPostgresRepo(db *gorm.DB) Repository {
	return &repo{
		DB: db,
	}
}
