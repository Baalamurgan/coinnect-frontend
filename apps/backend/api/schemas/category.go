package schemas

type CreateCategoryRequest struct {
	Name          string        `json:"name"`
	Description   string        `json:"description"`
	SubCategories []SubCategory `json:"sub_categories"`
	Items         []Item
}

type SubCategory struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type Item struct {
	Name        string   `json:"name"`
	Year        int      `json:"year"`
	ImageURL    string   `json:"image_url"`
	Description string   `json:"description"`
	Price       float64  `json:"price"`
	Details     []Detail `json:"details"`
}

type Detail struct {
	Attribute string `json:"attribute"`
	Value     string `json:"value"`
}
