const User = require("../models/User");
const Recipe = require("../models/Recipe");

// Get User Profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// Update User Profile
exports.updateUserProfile = async (req, res) => {
    try {
        const { fullName, email, profileImage, username,bio } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if username is already taken (except by the current user)
        if (username && username !== user.username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) return res.status(400).json({ message: "Username already exists" });
            user.username = username;
        }

        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.profileImage = profileImage || user.profileImage;
        user.bio = bio || user.bio;

        await user.save();
        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error("Error in updateUserProfile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



// Get Saved Recipes for User
exports.getSavedRecipes = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("savedRecipes");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user.savedRecipes);
    } catch (error) {
        console.error("Error in getSavedRecipes:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Save a Recipe for User
exports.saveRecipe = async (req, res) => {
    try {
        const { recipeId } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.savedRecipes.includes(recipeId)) {
            user.savedRecipes.push(recipeId);
            await user.save();
        }

        res.json({ message: "Recipe saved successfully", savedRecipes: user.savedRecipes });
    } catch (error) {
        console.error("Error in saveRecipe:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Like a Recipe
exports.likeRecipe = async (req, res) => {
    try {
        const { recipeId } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if the user has already liked this recipe
        if (user.likedRecipes.includes(recipeId)) {
            return res.status(400).json({ message: "You already liked this recipe" });
        }

        user.likedRecipes.push(recipeId);
        await user.save();

        res.json({ message: "Recipe liked successfully", likedRecipes: user.likedRecipes });
    } catch (error) {
        console.error("Error in likeRecipe:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Publish a Recipe
exports.publishRecipe = async (req, res) => {
    try {
        const { title, image, ingredients, steps, recipeType } = req.body;

        if (!title || !image || !ingredients || !steps || !recipeType) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!["Veg", "Non-Veg"].includes(recipeType)) {
            return res.status(400).json({ message: "Invalid recipe type. Must be 'Veg' or 'Non-Veg'." });
        }

        const newRecipe = new Recipe({
            title,
            image,
            ingredients,
            steps,
            recipeType,
            author: req.user.id,
        });

        await newRecipe.save();

        const user = await User.findById(req.user.id);
        user.publishedRecipes.push(newRecipe._id);
        await user.save();

        res.status(201).json({ message: "Recipe published successfully", newRecipe });
    } catch (error) {
        console.error("Error in publishRecipe:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



// Get User's Liked & Published Recipes
exports.getUserRecipes = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate("likedRecipes")
            .populate("publishedRecipes");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({
            likedRecipes: user.likedRecipes,
            publishedRecipes: user.publishedRecipes
        });
    } catch (error) {
        console.error("Error in getUserRecipes:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
// Unlike a Recipe
exports.unlikeRecipe = async (req, res) => {
    try {
        const { recipeId } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: "User not found" });

        // Remove the recipe from likedRecipes
        user.likedRecipes = user.likedRecipes.filter(id => id.toString() !== recipeId);
        await user.save();

        res.json({ message: "Recipe unliked successfully", likedRecipes: user.likedRecipes });
    } catch (error) {
        console.error("Error in unlikeRecipe:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Remove Saved Recipe
exports.removeSavedRecipe = async (req, res) => {
    try {
        const { recipeId } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: "User not found" });

        // Remove the recipe from savedRecipes
        user.savedRecipes = user.savedRecipes.filter(id => id.toString() !== recipeId);
        await user.save();

        res.json({ message: "Recipe removed from saved list", savedRecipes: user.savedRecipes });
    } catch (error) {
        console.error("Error in removeSavedRecipe:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.followUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const targetUser = await User.findOne({ username });

        if (!targetUser) return res.status(404).json({ message: "User not found" });

        const user = await User.findById(req.user.id);

        if (user.following.includes(targetUser._id)) {
            return res.status(400).json({ message: "You are already following this user" });
        }

        user.following.push(targetUser._id);
        targetUser.followers.push(req.user.id);

        await user.save();
        await targetUser.save();

        res.json({ message: "User followed successfully" });
    } catch (error) {
        console.error("Error in followUserByUsername:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.searchUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username }).select("-password"); // Hide password

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        console.error("Error in searchUserByUsername:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.checkUsernameAvailability = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });

        if (user) {
            return res.status(400).json({ message: "Username is already taken" });
        }
        res.json({ message: "Username is available" });
    } catch (error) {
        console.error("Error in checkUsernameAvailability:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
