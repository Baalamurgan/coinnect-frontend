package item

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

func GetAllItems(c *fiber.Ctx) error {
	var items []models.Item
	if err := db.GetDB().Preload("Details").Find(&items).Error; err != nil {
		return views.InternalServerError(c, err)
	}
	return views.StatusOK(c, items)
}

func GetItemsByCategoryID(c *fiber.Ctx) error {
	category_id := c.Params("category_id")
	if category_id == "" {
		return views.BadRequestWithMessage(c, "category id required")
	}
	var items []models.Item

	if err := db.GetDB().Where("category_id = ?", category_id).Find(&items).Error; err != nil {
		return views.InternalServerError(c, err)
	}
	return views.StatusOK(c, items)
}

func GetItemsBySubCategoryID(c *fiber.Ctx) error {
	sub_category_id := c.Params("sub_category_id")
	if sub_category_id == "" {
		return views.BadRequestWithMessage(c, "sub category id required")
	}
	var items []models.Item

	if err := db.GetDB().Where("sub_category_id = ?", sub_category_id).Find(&items).Error; err != nil {
		return views.InternalServerError(c, err)
	}
	return views.StatusOK(c, items)
}

func GetItemByID(c *fiber.Ctx) error {
	var item models.Item
	id := c.Params("id")
	if err := db.GetDB().Where("id = ?", id).First(&item).Error; err != nil {
		return views.InternalServerError(c, err)
	}
	return views.StatusOK(c, item)
}

func CreateItem(c *fiber.Ctx) error {
	category_id, err := uuid.Parse(c.Params("category_id"))
	if err != nil {
		return views.BadRequest(c)
	}
	sub_category_id, err := uuid.Parse(c.Params("sub_category_id"))
	if err != nil {
		return views.BadRequest(c)
	}
	var req schemas.CreateItemRequest
	if err := c.BodyParser(&req); err != nil {
		fmt.Println(c)
		return views.InvalidParams(c)
	}
	if err := utils.ValidateStruct(req); len(err) > 0 {
		return views.InvalidParams(c)
	}

	newItem := new(models.Item)
	newItem.Name = req.Name
	newItem.Description = req.Description
	newItem.Year = req.Year
	newItem.ImageURL = req.ImageURL
	newItem.Price = req.Price
	newItem.CategoryID = category_id
	newItem.SubCategoryID = sub_category_id

	for _, itemReq := range req.Details {
		newItem.Details = append(newItem.Details, models.Detail{
			Attribute: itemReq.Attribute,
			Value:     itemReq.Value,
		})
	}

	if err := db.GetDB().Create(&newItem).Error; err != nil {
		return views.InternalServerError(c, err)
	}

	return views.StatusOK(c, "item created successfully")
}

func UpdateItem(c *fiber.Ctx) error {
	id := c.Params("id")
	var req schemas.CreateItemRequest
	if err := c.BodyParser(&req); err != nil {
		fmt.Println(c)
		return views.InvalidParams(c)
	}
	if err := utils.ValidateStruct(req); len(err) > 0 {
		return views.InvalidParams(c)
	}

	if err := db.GetDB().Table("item").Where("id = ?", id).Updates(req).Error; err != nil {
		return views.InternalServerError(c, err)
	}
	return views.StatusOK(c, &req)
}

func DeleteItem(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := db.GetDB().Table("items").Where("id = ?", id).Delete(&models.Item{}).Error; err != nil {
		return views.InternalServerError(c, err)
	}
	return views.StatusOK(c, "item deleted")
}
