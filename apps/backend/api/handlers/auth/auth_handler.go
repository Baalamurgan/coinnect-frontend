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

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func LoginHandler(c *fiber.Ctx) error {
	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		fmt.Println(c)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid params",
		})
	}

	var user models.User
	if err := db.Connect().Where("email = ?", req.Email).First(&user).Error; err != nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "user doesn't exist",
		})
	}

	if user.Password != req.Password {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid password",
		})
	}

	return c.JSON(fiber.Map{"message": "Login successful"})
}
