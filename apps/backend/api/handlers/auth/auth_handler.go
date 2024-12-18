package auth

import (
	"fmt"

	"github.com/Baalamurgan/coin-selling-backend/api/db"
	"github.com/Baalamurgan/coin-selling-backend/pkg/models"
	"github.com/gofiber/fiber/v2"
)

type SignupRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func SignupHandler(c *fiber.Ctx) error {
	var req SignupRequest
	fmt.Println(c.BodyParser(&req))
	if err := c.BodyParser(&req); err != nil {
		fmt.Println(c)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid params",
		})
	}

	// check if user already exists in DB
	var existingUser models.User
	if err := db.Connect().Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "User already exists",
		})
	}

	newUser := models.User{
		Email:    req.Email,
		Password: req.Password,
		Username: req.Username,
	}

	if err := db.Connect().Create(&newUser).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "internal server error",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Signup successful",
		"user":    newUser.Email,
	})
}

func LoginHandler(c *fiber.Ctx) error {
	// Parse signup request, validate, and return response
	return c.JSON(fiber.Map{"message": "Signup successful"})
}
