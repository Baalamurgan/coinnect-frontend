package models

type Detail struct {
	ID        uint   `gorm:"primaryKey"`
	ItemID    uint   `gorm:"index"`
	Attribute string `gorm:"size:255;not null"`
	Value     string `gorm:"type:text"`
}
