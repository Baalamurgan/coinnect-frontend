package models

type User struct {
	// ID        uint   `json:"id" gorm:"primaryKey;type:uuid;default:uuid_generate_v4()"`
	Username  string `json:"username"`
	Email     string `json:"email" gorm:"unique"`
	Password  string `json:"-"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}
