package models

type Category struct {
	ID            uint          `gorm:"primaryKey"`
	Name          string        `gorm:"size:255;not null"`
	Description   string        `gorm:"type:text"`
	SubCategories []SubCategory `gorm:"foreignKey:CategoryID"`
	Items         []Item        `gorm:"foreignKey:CategoryID"`
}

type SubCategory struct {
	ID          uint   `gorm:"primaryKey"`
	Name        string `gorm:"size:255;not null"`
	Description string `gorm:"size:500"`
	CategoryID  uint   `gorm:"not null"`
}
