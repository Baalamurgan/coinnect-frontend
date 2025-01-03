package category

import (
	"fmt"

	"github.com/Baalamurgan/coin-selling-backend/api/db"
	"github.com/Baalamurgan/coin-selling-backend/api/schemas"
	"github.com/Baalamurgan/coin-selling-backend/api/utils"
	"github.com/Baalamurgan/coin-selling-backend/api/views"
	"github.com/Baalamurgan/coin-selling-backend/pkg/models"
	"github.com/gofiber/fiber/v2"
)

func GetAllCategories(c *fiber.Ctx) error {
	var categories []models.Category
	if err := db.GetDB().Preload("SubCategories").Preload("Items").Find(&categories).Error; err != nil {
		return views.InternalServerError(c, err)
	}
	return views.StatusOK(c, categories)
}

func GetCategoryByID(c *fiber.Ctx) error {
	var category models.Category
	id := c.Params("id")
	if err := db.GetDB().Where("id = ?", id).First(&category).Error; err != nil {
		return views.InternalServerError(c, err)
	}
	return views.StatusOK(c, category)
}

func CreateCategory(c *fiber.Ctx) error {
	var req schemas.CreateCategoryRequest
	if err := c.BodyParser(&req); err != nil {
		fmt.Println(c)
		return views.InvalidParams(c)
	}
	if err := utils.ValidateStruct(req); len(err) > 0 {
		return views.InvalidParams(c)
	}

	newCategory := new(models.Category)
	newCategory.Name = req.Name
	newCategory.Description = req.Description

	for _, subCategoryReq := range req.SubCategories {
		newCategory.SubCategories = append(newCategory.SubCategories, models.SubCategory{
			Name:        subCategoryReq.Name,
			Description: subCategoryReq.Description,
		})
	}

	for _, itemReq := range req.Items {
		newCategory.Items = append(newCategory.Items, models.Item{
			Name:        itemReq.Name,
			Year:        itemReq.Year,
			ImageURL:    itemReq.ImageURL,
			Description: itemReq.Description,
			Price:       itemReq.Price,
		})
	}

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

	if err := db.GetDB().Where("id = ?", id).Updates(req).Error; err != nil {
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
