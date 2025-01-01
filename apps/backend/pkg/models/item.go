package models

type Item struct {
	ID          uint   `gorm:"primaryKey"`
	Name        string `gorm:"size:255;not null"`
	CategoryID  uint   `gorm:"index"`
	Year        int
	ImageURL    string   `gorm:"size:512"`
	Description string   `gorm:"type:text"`
	Details     []Detail `gorm:"foreignKey:ItemID"`
}
