import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";
import { fetchTrendingRecipes } from "../api/axiosInstance";
import "../styles.css";

export default function Trending() {
    const navigate = useNavigate();
    const [trendingRecipes, setTrendingRecipes] = useState([]);

    useEffect(() => {
        const loadTrendingRecipes = async () => {
            try {
                const data = await fetchTrendingRecipes();
                setTrendingRecipes(data);
            } catch (error) {
                console.error("Error fetching trending recipes:", error);
            }
        };
        loadTrendingRecipes();
    }, []);

    return (
        <>
            <Navbar isLoggedIn={!!localStorage.getItem("token")} />
            <main className="recipe-feed">
                <div className="container">
                    <h1 className="mb-4">🔥 Trending Recipes</h1>
                    <div className="row g-4">
                        {trendingRecipes.length === 0 ? (
                            <p>No trending recipes found.</p>
                        ) : (
                            trendingRecipes.map((recipe) => (
                                <div className="col-md-4 col-lg-4 col-xl-3" key={recipe._id}>
                                    <RecipeCard recipe={recipe} />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}