const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true }, // Unique username
    fullName: String,
    email: { type: String, unique: true },
    password: String,
    profileImage: String,
    bio: { type: String, default: "" },  // ✅ New Bio Field
    savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
    likedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
    publishedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

module.exports = mongoose.model("User", userSchema);
