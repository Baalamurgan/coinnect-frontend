package routes

import (
	"github.com/Baalamurgan/coin-selling-backend/api/handlers/auth"
	"github.com/gofiber/fiber/v2"
)

// SetupRoutes registers all application routes
func SetupRoutes(app *fiber.App) {
	// Define a group for authentication-related routes
	authGroup := app.Group("/auth")
	authGroup.Post("/signup", auth.SignupHandler)
	authGroup.Post("/login", auth.LoginHandler)

	// You can define other route groups as well, e.g., user, admin, etc.
}
