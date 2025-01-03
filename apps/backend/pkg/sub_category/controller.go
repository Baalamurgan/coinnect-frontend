package sub_category

import (
	"fmt"

	"github.com/Baalamurgan/coin-selling-backend/api/db"
	"github.com/Baalamurgan/coin-selling-backend/api/schemas"
	"github.com/Baalamurgan/coin-selling-backend/api/utils"
	"github.com/Baalamurgan/coin-selling-backend/api/views"
	"github.com/Baalamurgan/coin-selling-backend/pkg/models"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func GetAllSubCategories(c *fiber.Ctx) error {
	var sub_categories []models.SubCategory
	if err := db.GetDB().Find(&sub_categories).Error; err != nil {
		return views.InternalServerError(c, err)
	}
	return views.StatusOK(c, sub_categories)
}

func GetAllSubCategoriesByCategoryID(c *fiber.Ctx) error {
	category_id := c.Params("category_id")
	if category_id == "" {
		return views.BadRequestWithMessage(c, "category id required")
	}
	var subCategories []models.SubCategory

	if err := db.GetDB().Where("category_id = ?", category_id).Find(&subCategories).Error; err != nil {
		return views.InternalServerError(c, err)
	}
	return views.StatusOK(c, subCategories)
}

func GetSubCategoryByID(c *fiber.Ctx) error {
	var sub_category models.SubCategory
	id := c.Params("id")
	if err := db.GetDB().Where("id = ?", id).First(&sub_category).Error; err != nil {
		return views.InternalServerError(c, err)
	}
	return views.StatusOK(c, sub_category)
}

func CreateSubCategory(c *fiber.Ctx) error {
	var req schemas.CreateSubCategoryRequest
	category_id, err := uuid.Parse(c.Params("category_id"))
	if err != nil {
		return views.BadRequest(c)
	}
	if err := c.BodyParser(&req); err != nil {
		fmt.Println(c)
		return views.InvalidParams(c)
	}
	if err := utils.ValidateStruct(req); len(err) > 0 {
		return views.InvalidParams(c)
	}

	newSubCategory := &models.SubCategory{
		Name:        req.Name,
		Description: req.Description,
		CategoryID:  category_id,
	}

	if err := db.GetDB().Create(&newSubCategory).Error; err != nil {
		return views.InternalServerError(c, err)
	}
	return views.StatusOK(c, "sub category created successfully")
}

func UpdateSubCategory(c *fiber.Ctx) error {
	id := c.Params("id")
	var req schemas.CreateSubCategoryRequest
	if err := c.BodyParser(&req); err != nil {
		fmt.Println(c)
		return views.InvalidParams(c)
	}
	if err := utils.ValidateStruct(req); len(err) > 0 {
		return views.InvalidParams(c)
	}

	if err := db.GetDB().Table("sub_categories").Where("id = ?", id).Updates(req).Error; err != nil {
		return views.InternalServerError(c, err)
	}
	return views.StatusOK(c, &req)
}

func DeleteSubCategory(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := db.GetDB().Table("sub_categories").Where("id = ?", id).Delete(&models.SubCategory{}).Error; err != nil {
		return views.InternalServerError(c, err)
	}
	return views.StatusOK(c, "sub category deleted")
}
