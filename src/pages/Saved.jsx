import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile, deleteRecipe } from "../api/axiosInstance";
import RecipeCard from "../components/RecipeCard";
import "../styles.css";
import styles from "./saved.module.css";

export default function Saved() {
    const navigate = useNavigate();
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState("date"); // Default sort by date
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [recipeToDelete, setRecipeToDelete] = useState(null);

    useEffect(() => {
        const loadSavedRecipes = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchUserProfile();
                let recipes = data.savedRecipes || []; // Assuming savedRecipes is the field
                recipes = sortRecipes(recipes, sortBy);
                setSavedRecipes(recipes);
            } catch (error) {
                setError("Failed to load saved recipes. Please try again.");
                console.error("Error fetching saved recipes:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadSavedRecipes();
    }, [sortBy]);

    const sortRecipes = (recipes, criteria) => {
        return [...recipes].sort((a, b) => {
            if (criteria === "title") return a.title.localeCompare(b.title);
            if (criteria === "date") return new Date(b.createdAt) - new Date(a.createdAt);
            return 0;
        });
    };

    const handleDelete = async () => {
        if (!recipeToDelete) return;
        setIsLoading(true);
        try {
            await deleteRecipe(recipeToDelete._id);
            setSavedRecipes((prev) => prev.filter((r) => r._id !== recipeToDelete._id));
            setShowDeleteModal(false);
            setRecipeToDelete(null);
        } catch (error) {
            setError("Failed to delete recipe. Please try again.");
            console.error("Error deleting recipe:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const confirmDelete = (recipe) => {
        setRecipeToDelete(recipe);
        setShowDeleteModal(true);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    return (
        <main className={styles.savedPage} aria-label="Saved Recipes">
            <div className={styles.container}>
                <header className={styles.header}>
                    <button
                        className={styles.backButton}
                        onClick={() => navigate(-1)}
                        aria-label="Go back"
                    >
                        ⬅ Back
                    </button>
                    <h1 className={styles.title}>📌 Saved Recipes</h1>
                    <div className={styles.sortControls}>
                        <label htmlFor="sortBy" className={styles.sortLabel}>Sort by:</label>
                        <select
                            id="sortBy"
                            value={sortBy}
                            onChange={handleSortChange}
                            className={styles.sortSelect}
                            disabled={isLoading}
                        >
                            <option value="date">Date Saved</option>
                            <option value="title">Title</option>
                        </select>
                    </div>
                </header>

                {isLoading ? (
                    <div className={styles.loadingSpinner} aria-live="polite">
                        Loading your saved recipes...
                    </div>
                ) : error ? (
                    <div className={styles.errorMessage} role="alert">
                        {error}
                        <button
                            className={styles.retryButton}
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </button>
                    </div>
                ) : savedRecipes.length === 0 ? (
                    <p className={styles.noRecipes}>No saved recipes yet.</p>
                ) : (
                    <div className={styles.recipeGrid}>
                        {savedRecipes.map((recipe) => (
                            <div key={recipe._id} className={styles.recipeItem}>
                                <RecipeCard recipe={recipe} />
                                <div className={styles.recipeActions}>
                                    <button
                                        className={styles.editButton}
                                        onClick={() => navigate(`/edit-recipe/${recipe._id}`)}
                                        aria-label={`Edit ${recipe.title}`}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className={styles.deleteButton}
                                        onClick={() => confirmDelete(recipe)}
                                        aria-label={`Delete ${recipe.title}`}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showDeleteModal && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <h3 className={styles.modalTitle}>Confirm Deletion</h3>
                            <p className={styles.modalText}>
                                Are you sure you want to delete "{recipeToDelete?.title}"?
                            </p>
                            <div className={styles.modalActions}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={styles.confirmButton}
                                    onClick={handleDelete}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}