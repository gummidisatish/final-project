const express = require("express");
const { getRecipes, addRecipe, searchRecipes, editRecipe, deleteRecipe, addReview, getRecipeById } = require("../controllers/recipeController");
const authenticate = require("../middleware/authMiddleware"); // Import middleware

const router = express.Router();

router.get("/", getRecipes);
router.get("/search", searchRecipes);
router.post("/", authenticate, addRecipe); // Protect adding recipes
router.get("/:id", getRecipeById); 
// Edit Recipe (Protected)
router.put("/:recipeId", authenticate, editRecipe);

// Delete Recipe (Protected)
router.delete("/:recipeId", authenticate, deleteRecipe);

// Add a review to a recipe
router.post("/:recipeId/review", authenticate, addReview);


module.exports = router;
