package schemas

import "github.com/google/uuid"

type CreateOrder struct {
	UserID uuid.UUID `json:"user_id"`
}
