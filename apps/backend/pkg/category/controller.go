package category

import (
	"github.com/Baalamurgan/coin-selling-backend/api/db"
	"github.com/Baalamurgan/coin-selling-backend/pkg/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type CategoryController struct {
	DB *gorm.DB
}

func GetAllCategories(c *fiber.Ctx) error {
	var categories []models.Category
	if err := db.GetDB().Find(&categories).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.JSON(fiber.Map{"categories": categories})
}
