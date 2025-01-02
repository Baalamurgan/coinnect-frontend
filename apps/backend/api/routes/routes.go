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
	authGroup.Get("/users", auth.GetAllUsersHandler)

	categoryGroup := app.Group("/category")
	categoryGroup.Get("/", category.GetAllCategories)
	categoryGroup.Get("/:id", category.GetCategoryByID)
	categoryGroup.Post("/", category.CreateCategory)
	categoryGroup.Put("/:id", category.UpdateCategory)
	categoryGroup.Delete("/:id", category.DeleteCategory)
}
