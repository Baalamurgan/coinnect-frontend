package routes

import (
	"github.com/Baalamurgan/coin-selling-backend/pkg/auth"
	"github.com/Baalamurgan/coin-selling-backend/pkg/category"
	"github.com/Baalamurgan/coin-selling-backend/pkg/sub_category"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")
	v1 := api.Group("/v1")
	authGroup := v1.Group("/auth")
	authGroup.Post("/signup", auth.Signup)
	authGroup.Post("/login", auth.Login)
	authGroup.Get("/users", auth.GetAllUsers)

	categoryGroup := v1.Group("/category")
	categoryGroup.Get("/", category.GetAllCategories)
	categoryGroup.Get("/:id", category.GetCategoryByID)
	categoryGroup.Post("/", category.CreateCategory)
	categoryGroup.Put("/:id", category.UpdateCategory)
	categoryGroup.Delete("/:id", category.DeleteCategory)

	subCategoryGroup := v1.Group("/sub_category")
	subCategoryGroup.Get("/", sub_category.GetAllSubCategories)
	subCategoryGroup.Get("/:id", sub_category.GetSubCategoryByID)
	subCategoryGroup.Post("/", sub_category.CreateSubCategory)
	subCategoryGroup.Put("/:id", sub_category.UpdateSubCategory)
	subCategoryGroup.Delete("/:id", sub_category.DeleteSubCategory)
}
