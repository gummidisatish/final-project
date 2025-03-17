const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Who wrote the review
    rating: { type: Number, min: 1, max: 5, required: true }, // 1-5 star rating
    comment: String, // Optional comment
    createdAt: { type: Date, default: Date.now }
});

const recipeSchema = new mongoose.Schema({
    title: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    likes: { type: Number, default: 0 },
    image: String,
    ingredients: [String],
    steps: [String],
    status: { type: String, enum: ["Published", "Draft"], default: "Published" },
    recipeType: { type: String, enum: ["Veg", "Non-Veg"], required: true },
    reviews: [reviewSchema], // Array of reviews
    averageRating: { type: Number, default: 0 } // Average rating of the recipe
});

module.exports = mongoose.model("Recipe", recipeSchema);
