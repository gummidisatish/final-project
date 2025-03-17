import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";
import FilterComponent from "../components/FilterComponent";
import { fetchRecipes } from "../api/axiosInstance";
import "../styles.css";
import "./Home.module.css";

export default function Home() {
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [filters, setFilters] = useState({ category: "all", cookingTime: "all" });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const isLoggedIn = !!localStorage.getItem("token");

    useEffect(() => {
        const loadRecipes = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchRecipes();
                setRecipes(data);
                setFilteredRecipes(data);
            } catch (error) {
                setError("Failed to load recipes. Please try again later.");
                console.error("Error loading recipes:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadRecipes();
    }, []);

    const handleFilterApply = ({ category, cookingTime }) => {
        setFilters({ category, cookingTime });
        let filtered = [...recipes];

        if (category !== "all") {
            filtered = filtered.filter((recipe) =>
                recipe.recipeType?.toLowerCase() === category.toLowerCase()
            );
        }

        if (cookingTime !== "all") {
            filtered = filtered.filter((recipe) => {
                const time = Number(recipe.cookingTime) || 0;
                switch (cookingTime) {
                    case "30":
                        return time < 30;
                    case "60":
                        return time >= 30 && time <= 60;
                    case "60+":
                        return time > 60;
                    default:
                        return true;
                }
            });
        }

        setFilteredRecipes(filtered);
    };

    return (
        <>
            <Navbar isLoggedIn={isLoggedIn} />
            <main className="recipe-feed" aria-label="Recipe Feed">
                <div className="container">
                    <header className="feed-header">
                        <h1 className="feed-title">🍽️ Latest Recipes</h1>
                        <div className="feed-controls">
                            <button
                                className="filter-btn"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#filterOffcanvas"
                                aria-label="Open recipe filters"
                            >
                                🔍 Filter Recipes
                            </button>
                        </div>
                    </header>

                    <FilterComponent onFilterApply={handleFilterApply} />

                    {isLoading ? (
                        <div className="loading-spinner" aria-live="polite">
                            Loading recipes...
                        </div>
                    ) : error ? (
                        <div className="error-message" role="alert">
                            {error}
                            <button
                                className="retry-btn"
                                onClick={() => window.location.reload()}
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <div className="recipe-grid">
                            {filteredRecipes.length === 0 ? (
                                <p className="no-recipes">
                                    No recipes match your filters. Try adjusting them!
                                </p>
                            ) : (
                                filteredRecipes.map((recipe) => (
                                    <RecipeCard
                                        key={recipe._id}
                                        recipe={recipe}
                                        className="recipe-card"
                                    />
                                ))
                            )}
                        </div>
                    )}
                </div>
            </main>

            {isLoggedIn && (
                <Link
                    to="/newpost"
                    className="floating-btn"
                    aria-label="Create new recipe post"
                >
                    ➕
                </Link>
            )}
        </>
    );
}