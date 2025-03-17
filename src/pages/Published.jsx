import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../api/axiosInstance";
import "../styles.css";

export default function Published() {
    const navigate = useNavigate();
    const [publishedRecipes, setPublishedRecipes] = useState([]);

    useEffect(() => {
        const loadPublishedRecipes = async () => {
            try {
                const data = await fetchUserProfile();
                setPublishedRecipes(data.publishedRecipes);
            } catch (error) {
                console.error("Error fetching published recipes:", error);
            }
        };
        loadPublishedRecipes();
    }, []);

    return (
        <>
            <button className="backButton" onClick={() => navigate(-1)}>⬅ Back</button>
            <main className="container mt-4">
                <h1>📌 Published Recipes</h1>
                <div className="row">
                    {publishedRecipes.length === 0 ? (
                        <p>No published recipes yet.</p>
                    ) : (
                        publishedRecipes.map((recipe) => (
                            <div className="col-md-4 mb-4" key={recipe._id}>
                                <div className="card recipeCard">
                                    <img src={recipe.image} className="card-img-top" alt={recipe.title} />
                                    <div className="card-body">
                                        <h5 className="card-title">{recipe.title}</h5>
                                        <p className="card-text">{recipe.description.substring(0, 50)}...</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </>
    );
}
