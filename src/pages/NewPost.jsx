import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRecipe } from "../api/axiosInstance";
import "../styles.css";

export default function NewPost() {
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState({
        title: "",
        description: "",
        ingredients: [""],
        instructions: [""],
        cookingTime: "",
        recipeType: "",
        image: "", // Image URL instead of a file
    });

    const handleChange = (e) => {
        setRecipe({ ...recipe, [e.target.name]: e.target.value });
    };

    const addIngredient = () => {
        setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ""] });
    };

    const addInstruction = () => {
        setRecipe({ ...recipe, instructions: [...recipe.instructions, ""] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const userId = localStorage.getItem("userId"); // Get user ID from localStorage
        if (!userId) {
            console.error("User not logged in!");
            return;
        }
    
        const recipeData = {
            ...recipe,
            author: userId, // Include userId in the request
        };
    
        try {
            await createRecipe(recipeData);
            navigate("/home");
        } catch (error) {
            console.error("Error creating recipe:", error);
        }
    };
    

    return (
        <div className="new-post-container">
            <button className="back-button" onClick={() => navigate(-1)}>⬅ Back</button>
            <h2 className="new-post-title">New Recipe</h2>
            <form onSubmit={handleSubmit} className="new-post-form">
                <div className="form-group">
                    <label>Recipe Title</label>
                    <input type="text" name="title" placeholder="Recipe Title" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Recipe Description</label>
                    <textarea name="description" placeholder="Recipe Description" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Ingredients</label>
                    {recipe.ingredients.map((ingredient, index) => (
                        <input
                            key={index}
                            type="text"
                            value={ingredient}
                            onChange={(e) => {
                                const updatedIngredients = [...recipe.ingredients];
                                updatedIngredients[index] = e.target.value;
                                setRecipe({ ...recipe, ingredients: updatedIngredients });
                            }}
                            required
                        />
                    ))}
                    <button type="button" className="add-button" onClick={addIngredient}>+ Add Ingredient</button>
                </div>
                <div className="form-group">
                    <label>Instructions</label>
                    {recipe.instructions.map((step, index) => (
                        <textarea
                            key={index}
                            rows="2"
                            value={step}
                            onChange={(e) => {
                                const updatedInstructions = [...recipe.instructions];
                                updatedInstructions[index] = e.target.value;
                                setRecipe({ ...recipe, instructions: updatedInstructions });
                            }}
                            required
                        />
                    ))}
                    <button type="button" className="add-button" onClick={addInstruction}>+ Add Step</button>
                </div>
                <div className="form-group">
                    <label>Cooking Time</label>
                    <input type="text" name="cookingTime" placeholder="Cooking Time (e.g., 30 mins)" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Category</label>
                    <select name="recipeType" onChange={handleChange} required>
                        <option value="">Select Category</option>
                        <option value="Veg">Veg</option>
                        <option value="Non-Veg">Non-Veg</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Recipe Image (URL)</label>
                    <input type="text" name="image" placeholder="Paste image URL here" onChange={handleChange} required />
                </div>
                <button type="submit" className="submit-button">Publish</button>
            </form>
        </div>
    );
}
