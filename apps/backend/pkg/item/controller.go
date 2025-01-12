package item

import (
	"fmt"
	"math"
	"strconv"

	"github.com/Baalamurgan/coin-selling-backend/api/db"
	"github.com/Baalamurgan/coin-selling-backend/api/schemas"
	"github.com/Baalamurgan/coin-selling-backend/api/utils"
	"github.com/Baalamurgan/coin-selling-backend/api/views"
	"github.com/Baalamurgan/coin-selling-backend/pkg/models"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func GetAllItems(c *fiber.Ctx) error {
	page, err := strconv.Atoi(c.Query("page", "1")) // Default to page 1
	if err != nil || page < 1 {
		return views.BadRequest(c)
	}

	limit, err := strconv.Atoi(c.Query("limit", "10")) // Default to 10 items per page
	if err != nil || limit < 1 {
		return views.BadRequest(c)
	}

	var items []models.Item
	var total int64

	if err := db.GetDB().Table("items").Count(&total).Error; err != nil {
		return views.InternalServerError(c, err)
	}

	if err := db.GetDB().Table("items").Order("updated_at DESC").Preload("Details").Scopes(utils.Paginate(page, limit)).Find(&items).Error; err != nil {
		return views.InternalServerError(c, err)
	}
	return views.StatusOK(c, fiber.Map{
		"items": items,
		"pagination": fiber.Map{
			"page":          page,
			"limit":         limit,
			"total_records": total,
			"total_pages":   int(math.Ceil(float64(total) / float64(limit))),
		},
	})
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
	var req schemas.CreateItemRequest
	if err := c.BodyParser(&req); err != nil {
		fmt.Println(c)
		return views.InvalidParams(c)
	}
	if err := utils.ValidateStruct(req); len(err) > 0 {
		return views.InvalidParams(c)
	}

	newItem := new(models.Item)
	newItem.CategoryID = category_id
	newItem.Name = req.Name
	newItem.Description = req.Description
	newItem.Year = req.Year
	newItem.SKU = req.SKU
	newItem.ImageURL = req.ImageURL
	newItem.Stock = req.Stock
	newItem.Sold = req.Sold
	newItem.Price = req.Price
	newItem.GST = req.GST

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
	var req schemas.UpdateItemRequest
	if err := c.BodyParser(&req); err != nil {
		return views.InvalidParams(c)
	}
	if err := utils.ValidateStruct(req); len(err) > 0 {
		return views.InvalidParams(c)
	}

	var item models.Item
	if err := db.GetDB().Table("items").Where("id = ?", id).First(&item).Error; err != nil {
		return views.RecordNotFound(c)
	}

	item.CategoryID = *req.CategoryID
	item.Name = *req.Name
	item.Description = *req.Description
	item.Year = *req.Year
	item.SKU = *req.SKU
	item.ImageURL = *req.ImageURL
	item.Stock = *req.Stock
	item.Sold = *req.Sold
	item.Price = *req.Price
	item.GST = *req.GST

	if err := db.GetDB().Save(&item).Error; err != nil {
		return views.InternalServerError(c, err)
	}

	return views.StatusOK(c, "item updated successfully")
}

func DeleteItem(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := db.GetDB().Table("items").Where("id = ?", id).Delete(&models.Item{}).Error; err != nil {
		return views.InternalServerError(c, err)
	}
	return views.StatusOK(c, "item deleted")
}
