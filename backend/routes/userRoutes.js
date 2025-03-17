const express = require("express");
const { getUserProfile, updateUserProfile, getSavedRecipes, saveRecipe, searchUserByUsername ,checkUsernameAvailability} = require("../controllers/userController");
const { followUserByUsername, likeRecipe, publishRecipe, getUserRecipes,unlikeRecipe, removeSavedRecipe } = require("../controllers/userController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

// Get User Profile
router.get("/profile", authenticate, getUserProfile);

// Search user by username
router.get("/search/:username", searchUserByUsername);

router.get("/check-username/:username", checkUsernameAvailability);

// Follow a user
router.post("/follow/username/:username", authenticate, followUserByUsername);

// Unlike a Recipe
router.post("/unlike", authenticate, unlikeRecipe);

// Remove a Saved Recipe
router.post("/remove-saved", authenticate, removeSavedRecipe);


// Update User Profile
router.put("/profile", authenticate, updateUserProfile);

// Get Saved Recipes
router.get("/saved", authenticate, getSavedRecipes);

// Save a Recipe
router.post("/saved", authenticate, saveRecipe);

// Like a Recipe
router.post("/like", authenticate, likeRecipe);

// Publish a Recipe
router.post("/publish", authenticate, publishRecipe);

// Get User's Liked & Published Recipes
router.get("/my-recipes", authenticate, getUserRecipes);

module.exports = router;
