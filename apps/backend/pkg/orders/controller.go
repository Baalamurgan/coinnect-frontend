package orders

import (
	"fmt"

	"github.com/Baalamurgan/coin-selling-backend/api/db"
	"github.com/Baalamurgan/coin-selling-backend/api/schemas"
	"github.com/Baalamurgan/coin-selling-backend/api/utils"
	"github.com/Baalamurgan/coin-selling-backend/api/views"
	"github.com/Baalamurgan/coin-selling-backend/pkg/models"
	"github.com/gofiber/fiber/v2"
)

func GetOrderByID(c *fiber.Ctx) error {
	var order models.Orders
	id := c.Params("id")
	if err := db.GetDB().Model(&models.Orders{}).Where("id = ?", id).Preload("OrderItem").First(&order).Error; err != nil {
		return views.InternalServerError(c, err)
	}
	return views.StatusOK(c, order)
}

func CreateOrder(c *fiber.Ctx) error {
	var req schemas.CreateOrder
	if err := c.BodyParser(&req); err != nil {
		fmt.Println(c)
		return views.InvalidParams(c)
	}
	if err := utils.ValidateStruct(req); len(err) > 0 {
		return views.InvalidParams(c)
	}

	var user models.User
	if err := db.GetDB().Table("users").Where("id = ?", req.UserID).First(&user).Error; err != nil {
		return views.BadRequest(c)
	}

	newOrder := models.Orders{
		UserID: req.UserID,
	}
	if err := db.GetDB().Create(&newOrder).Error; err != nil {
		return views.InternalServerError(c, err)
	}
	return views.ObjectCreated(c, newOrder)

}

// func AddToCart(cartID uuid.UUID, itemID uuid.UUID, quantity int) error {
// 	var item models.Item
// 	if err := db.GetDB().First(&item, itemID).Error; err != nil {
// 		return err // Item not found
// 	}

// 	cartItem := models.CartItem{
// 		CartID:   cartID,
// 		ItemID:   itemID,
// 		Quantity: quantity,
// 		Price:    item.Price, // Record the price at the time of addition
// 	}

// 	return db.GetDB().Create(&cartItem).Error
// }

func DeleteOrder(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := db.GetDB().Where("id = ?", id).Delete(&models.Orders{}).Error; err != nil {
		return views.InternalServerError(c, err)
	}
	return views.StatusOK(c, "order deleted")
}
