import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchRecipeById, likeRecipe, saveRecipe } from "../api/axiosInstance";
import "../styles.css";

export default function Recipe() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likes, setLikes] = useState(0);
    const [isSaved, setIsSaved] = useState(false);
    const isLoggedIn = !!localStorage.getItem("token");

    useEffect(() => {
        const loadRecipe = async () => {
            try {
                const data = await fetchRecipeById(id);
                setRecipe(data);
                setLikes(data.likes);
                setIsSaved(data.isSaved);
            } catch (err) {
                console.error("Error fetching recipe:", err);
                setError("Failed to load recipe.");
            } finally {
                setLoading(false);
            }
        };
        loadRecipe();
    }, [id]);

    const handleLike = async () => {
        if (!isLoggedIn) return alert("You must be logged in to like recipes.");
        try {
            await likeRecipe(id);
            setLikes(likes + 1);
        } catch (err) {
            console.error("Error liking recipe:", err);
        }
    };

    const handleSave = async () => {
        if (!isLoggedIn) return alert("You must be logged in to save recipes.");
        try {
            await saveRecipe(id);
            setIsSaved(!isSaved);
        } catch (err) {
            console.error("Error saving recipe:", err);
        }
    };

    if (loading) return <p className="loading-text">Loading recipe...</p>;
    if (error) return <p className="error-text">{error}</p>;

    return (
        <div className="recipe-page">
            <button className="back-button" onClick={() => navigate(-1)}>⬅ Back</button>
            <div className="recipe-container">
                <img src={recipe.image} alt={recipe.title} className="recipe-image" />
                <div className="recipe-content">
                    <h1>{recipe.title}</h1>
                    <p className="recipe-description">{recipe.description}</p>

                    <h3>🛒 Ingredients</h3>
                    <ul className="recipe-list">
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>

                    <h3>📖 Instructions</h3>
                    <ol className="recipe-list">
                        {recipe.instructions.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>

                    <div className="recipe-footer">
                        <p>⏳ Cooking Time: {recipe.cookingTime}</p>
                        <p>📌 Category: {recipe.recipeType}</p>
                        <p>👨‍🍳 Created by: {recipe.author?.username || "Anonymous"}</p>
                        <p>❤️ {likes} Likes</p>
                    </div>

                    {/* Like & Save Buttons */}
                    {isLoggedIn && (
                        <div className="recipe-actions">
                            <button className="btn btn-outline-danger" onClick={handleLike}>
                                ❤️ Like ({likes})
                            </button>
                            <button className={`btn ${isSaved ? "btn-success" : "btn-outline-secondary"}`} onClick={handleSave}>
                                {isSaved ? "✔ Saved" : "💾 Save"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}