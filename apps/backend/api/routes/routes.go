package routes

import (
	"github.com/Baalamurgan/coin-selling-backend/pkg/auth"
	"github.com/Baalamurgan/coin-selling-backend/pkg/category"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	authGroup := app.Group("/auth")
	authGroup.Post("/signup", auth.SignupHandler)
	authGroup.Post("/login", auth.LoginHandler)

	categoryGroup := app.Group("/category")
	categoryGroup.Get("/", category.GetAllCategories)
	// categoryGroup.Get("/:id", controllers.GetCategoryByID)
	// categoryGroup.Post("/", controllers.CreateCategory)
	// categoryGroup.Put("/:id", controllers.UpdateCategory)
	// categoryGroup.Delete("/:id", controllers.DeleteCategory)
}
