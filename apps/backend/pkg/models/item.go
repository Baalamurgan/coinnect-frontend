package models

import "github.com/google/uuid"

type Item struct {
	ID            uuid.UUID `gorm:"primaryKey;type:uuid;default:uuid_generate_v4()" json:"id"`
	CategoryID    uuid.UUID `gorm:"index;type:uuid" json:"category_id"`
	SubCategoryID uuid.UUID `gorm:"index;type:uuid" json:"sub_category_id"`
	Name          string    `gorm:"size:255;not null" json:"name"`
	Year          int       `json:"year"`
	ImageURL      string    `gorm:"size:512" json:"image_url"`
	Description   string    `gorm:"type:text" json:"description"`
	Price         float64   `gorm:"not null" json:"price"`
	Details       []Detail  `gorm:"constraint:OnUpdate:CASCADE,onDelete:CASCADE;" json:"details"`
	CreatedAt     int       `json:"created_at"`
	UpdatedAt     int       `json:"updated_at"`
}
