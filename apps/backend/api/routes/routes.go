package routes

import (
	"github.com/Baalamurgan/coin-selling-backend/pkg/auth"
	"github.com/Baalamurgan/coin-selling-backend/pkg/category"
	"github.com/Baalamurgan/coin-selling-backend/pkg/item"
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
	categoryGroup.Get("/:id/all", category.GetAllCategoriesByParentCategoryID)
	categoryGroup.Post("/", category.CreateCategory)
	categoryGroup.Put("/:id", category.UpdateCategory)
	categoryGroup.Delete("/:id", category.DeleteCategory)

	// subCategoryGroup := v1.Group("/sub_category")
	// subCategoryGroup.Get("/", sub_category.GetAllSubCategories)
	// subCategoryGroup.Get("/category/:category_id", sub_category.GetAllSubCategoriesByCategoryID)
	// subCategoryGroup.Get("/:id", sub_category.GetSubCategoryByID)
	// subCategoryGroup.Post("/:category_id", sub_category.CreateSubCategory)
	// subCategoryGroup.Put("/:id", sub_category.UpdateSubCategory)
	// subCategoryGroup.Delete("/:id", sub_category.DeleteSubCategory)

	itemGroup := v1.Group("/item")
	itemGroup.Get("/", item.GetAllItems)                                          // Get all items
	itemGroup.Get("/category/:category_id", item.GetItemsByCategoryID)            // Get items by category
	itemGroup.Get("/sub_category/:sub_category_id", item.GetItemsBySubCategoryID) // Get items by sub-category
	itemGroup.Get("/:id", item.GetItemByID)                                       // Get item by ID
	itemGroup.Post("/:category_id", item.CreateItem)
	itemGroup.Put("/:id", item.UpdateItem) // Update an item
	itemGroup.Delete("/:id", item.DeleteItem)

	// coinGroup := itemGroup.Group("/coin")
}
