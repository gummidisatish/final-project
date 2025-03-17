const Recipe = require("../models/Recipe");

exports.getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate("author", "username profileImage");
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });
        res.json(recipe);
    } catch (error) {
        console.error("Error fetching recipe:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.createRecipe = async (req, res) => {
    try {
        const { title, description, ingredients, instructions, cookingTime, recipeType, image, author } = req.body;

        if (!author) {
            return res.status(400).json({ message: "Author is required" });
        }

        const newRecipe = new Recipe({
            title,
            description,
            ingredients,
            instructions,
            cookingTime,
            recipeType,
            image,
            author, // Ensure author ID is saved
        });

        await newRecipe.save();
        res.status(201).json({ message: "Recipe created successfully", recipe: newRecipe });
    } catch (error) {
        console.error("Error creating recipe:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.json(recipes);
    } catch (error) {
        console.error("Error fetching recipes:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.addRecipe = async (req, res) => {
    try {
        const newRecipe = new Recipe(req.body);
        await newRecipe.save();
        res.status(201).json(newRecipe);
    } catch (error) {
        console.error("Error adding recipe:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.searchRecipes = async (req, res) => {
    try {
        const { query, recipeType, sortBy, page = 1, limit = 10 } = req.query;
        let filter = {};

        // Search by title or ingredients
        if (query) {
            filter.$or = [
                { title: { $regex: query, $options: "i" } },
                { ingredients: { $regex: query, $options: "i" } }
            ];
        }

        // Filter by recipe type (Veg/Non-Veg)
        if (recipeType) {
            if (!["Veg", "Non-Veg"].includes(recipeType)) {
                return res.status(400).json({ message: "Invalid recipe type. Must be 'Veg' or 'Non-Veg'." });
            }
            filter.recipeType = recipeType;
        }

        let recipesQuery = Recipe.find(filter);

        // Sorting Logic
        if (sortBy === "trending") {
            recipesQuery = recipesQuery.sort({ likes: -1 }); // Most liked recipes
        } else if (sortBy === "recent") {
            recipesQuery = recipesQuery.sort({ createdAt: -1 }); // Newest recipes first
        }

        // Pagination Logic
        const skip = (parseInt(page) - 1) * parseInt(limit);
        recipesQuery = recipesQuery.skip(skip).limit(parseInt(limit));

        const recipes = await recipesQuery;
        res.json(recipes);
    } catch (error) {
        console.error("Error in searchRecipes:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



// Edit Recipe (Only by Owner)
exports.editRecipe = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const { title, image, ingredients, steps } = req.body;

        const recipe = await Recipe.findById(recipeId);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        // Check if the user is the owner of the recipe
        if (recipe.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only edit your own recipes" });
        }

        // Update recipe fields
        recipe.title = title || recipe.title;
        recipe.image = image || recipe.image;
        recipe.ingredients = ingredients || recipe.ingredients;
        recipe.steps = steps || recipe.steps;
        await recipe.save();

        res.json({ message: "Recipe updated successfully", recipe });
    } catch (error) {
        console.error("Error in editRecipe:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Delete Recipe (Only by Owner)
exports.deleteRecipe = async (req, res) => {
    try {
        const { recipeId } = req.params;

        const recipe = await Recipe.findById(recipeId);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        // Check if the user is the owner
        if (recipe.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only delete your own recipes" });
        }

        await recipe.deleteOne();
        res.json({ message: "Recipe deleted successfully" });
    } catch (error) {
        console.error("Error in deleteRecipe:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.addReview = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const { rating, comment } = req.body;

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5 stars" });
        }

        const recipe = await Recipe.findById(recipeId);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        const newReview = { user: req.user.id, rating, comment };
        recipe.reviews.push(newReview);

        // Calculate new average rating
        const totalRatings = recipe.reviews.reduce((sum, r) => sum + r.rating, 0);
        recipe.averageRating = totalRatings / recipe.reviews.length;

        await recipe.save();
        res.json({ message: "Review added successfully", recipe });
    } catch (error) {
        console.error("Error in addReview:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.saveDraft = async (req, res) => {
    try {
        const newRecipe = new Recipe({ ...req.body, author: req.user.id, status: "Draft" });
        await newRecipe.save();
        res.json({ message: "Recipe saved as draft", newRecipe });
    } catch (error) {
        console.error("Error in saveDraft:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
