package models

import "github.com/google/uuid"

type SubCategory struct {
	ID          uuid.UUID `gorm:"primaryKey;type:uuid;default:uuid_generate_v4()" json:"id"`
	Name        string    `gorm:"size:255;not null" json:"name"`
	Description string    `gorm:"size:500" json:"description"`
	CategoryID  uuid.UUID `gorm:"not null;type:uuid" json:"category_id"`
	CreatedAt   int       `json:"created_at"`
	UpdatedAt   int       `json:"updated_at"`
}
