package schemas

type CreateItemRequest struct {
	Name        string   `json:"name"`
	Year        int      `json:"year"`
	ImageURL    string   `json:"image_url"`
	Description string   `json:"description"`
	Price       float64  `json:"price"`
	Details     []Detail `json:"details"`
}
