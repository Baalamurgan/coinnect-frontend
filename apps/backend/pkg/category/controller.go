package category

import (
	"fmt"
	"strconv"

	"github.com/Baalamurgan/coin-selling-backend/api/db"
	"github.com/Baalamurgan/coin-selling-backend/api/schemas"
	"github.com/Baalamurgan/coin-selling-backend/api/utils"
	"github.com/Baalamurgan/coin-selling-backend/api/views"
	"github.com/Baalamurgan/coin-selling-backend/pkg/models"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func GetAllCategories(c *fiber.Ctx) error {
	page, err := strconv.Atoi(c.Query("page", "1"))
	if err != nil || page < 1 {
		return views.BadRequest(c)
	}

	limit, err := strconv.Atoi(c.Query("limit", "10"))
	if err != nil || limit < 1 {
		return views.BadRequest(c)
	}

	searchQuery := c.Query("search", "")

	var categories []models.Category
	var total int64
	dbQuery := db.GetDB().Model(&models.Category{}).Preload("Items")

	if searchQuery != "" {
		dbQuery = dbQuery.Where("name ILIKE ? OR description ILIKE ?", "%"+searchQuery+"%", "%"+searchQuery+"%")
	}

	if err := dbQuery.Count(&total).Error; err != nil {
		return views.InternalServerError(c, err)
	}

	if err := dbQuery.Order("updated_at DESC").Scopes(utils.Paginate(page, limit)).Find(&categories).Error; err != nil {
		return views.InternalServerError(c, err)
	}
	return views.StatusOK(c, fiber.Map{
		"categories": categories,
		"pagination": fiber.Map{
			"page":          page,
			"limit":         limit,
			"total_records": total,
			"total_pages":   utils.CalculateTotalPages(total, limit),
		},
	})
}

func GetCategoryByID(c *fiber.Ctx) error {
	var category models.Category
	id := c.Params("id")
	if err := db.GetDB().Where("id = ?", id).First(&category).Error; err != nil {
		return views.InternalServerError(c, err)
	}
	return views.StatusOK(c, category)
}

func GetAllCategoriesByParentCategoryID(c *fiber.Ctx) error {
	var categories []models.Category
	id := c.Params("id")
	if err := db.GetDB().Where("parent_category_id = ?", id).Find(&categories).Error; err != nil {
		return views.InternalServerError(c, err)
	}
	return views.StatusOK(c, categories)
}

func CreateCategory(c *fiber.Ctx) error {
	var req schemas.CreateCategoryRequest
	if err := c.BodyParser(&req); err != nil {
		return views.InvalidParams(c)
	}
	if err := utils.ValidateStruct(req); len(err) > 0 {
		return views.InvalidParams(c)
	}

	newCategory := new(models.Category)
	newCategory.Name = req.Name
	newCategory.Description = req.Description
	if req.ParentCategoryID == "" {
		newCategory.ParentCategoryID = nil
	} else {
		parentID, err := uuid.Parse(req.ParentCategoryID)
		if err != nil {
			return views.InvalidParams(c)
		}
		newCategory.ParentCategoryID = &parentID
	}

	// for _, itemReq := range req.Items {
	// 	newCategory.Items = append(newCategory.Items, models.Item{
	// 		Name:        itemReq.Name,
	// 		Year:        itemReq.Year,
	// 		ImageURL:    itemReq.ImageURL,
	// 		Description: itemReq.Description,
	// 		Price:       itemReq.Price,
	// 	})
	// }

	if err := db.GetDB().Create(&newCategory).Error; err != nil {
		return views.InternalServerError(c, err)
	}

	return views.StatusOK(c, "category created successfully")
}

func UpdateCategory(c *fiber.Ctx) error {
	id := c.Params("id")
	var req schemas.CreateCategoryRequest
	if err := c.BodyParser(&req); err != nil {
		fmt.Println(c)
		return views.InvalidParams(c)
	}
	if err := utils.ValidateStruct(req); len(err) > 0 {
		return views.InvalidParams(c)
	}

	if err := db.GetDB().Table("category").Where("id = ?", id).Updates(req).Error; err != nil {
		return views.InternalServerError(c, err)
	}
	return views.StatusOK(c, &req)
}

func DeleteCategory(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := db.GetDB().Table("categories").Where("id = ?", id).Delete(&models.Category{}).Error; err != nil {
		return views.InternalServerError(c, err)
	}
	return views.StatusOK(c, "category deleted")
}
