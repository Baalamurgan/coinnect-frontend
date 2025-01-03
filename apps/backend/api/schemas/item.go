package schemas

type CreateItemRequest struct {
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Year        int      `json:"year"`
	ImageURL    string   `json:"image_url"`
	Price       float64  `json:"price"`
	Details     []Detail `json:"details"`
}
