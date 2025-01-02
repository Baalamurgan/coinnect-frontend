package models

import "github.com/google/uuid"

type Category struct {
	ID            uuid.UUID     `gorm:"primaryKey;type:uuid;default:uuid_generate_v4()" json:"id"`
	Name          string        `gorm:"not null" json:"name"`
	Description   string        `gorm:"type:text" json:"description"`
	SubCategories []SubCategory `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"sub_categories"`
	Items         []Item        `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"items"`
	CreatedAt     int           `json:"created_at"`
	UpdatedAt     int           `json:"updated_at"`
}
