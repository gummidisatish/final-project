import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import { searchRecipes } from "../api/axiosInstance";
import "../styles.css";


export default function Search() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        sortBy: "relevance",
        category: "all",
    });
    const [debouncedQuery, setDebouncedQuery] = useState("");

    // Debounce function to limit API calls
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

    const performSearch = useCallback(async (searchQuery) => {
        if (searchQuery.length <= 2) {
            setResults([]);
            setError(null);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const data = await searchRecipes({
                query: searchQuery,
                sortBy: filters.sortBy,
                category: filters.category !== "all" ? filters.category : undefined,
            });
            setResults(data || []);
        } catch (error) {
            setError("Failed to search recipes. Please try again.");
            console.error("Error searching recipes:", error);
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    // Debounced search handler
    const debouncedSearch = useCallback(
        debounce((query) => {
            setDebouncedQuery(query);
            performSearch(query);
        }, 500),
        [performSearch]
    );

    const handleSearchChange = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        debouncedSearch(newQuery);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        if (debouncedQuery) {
            performSearch(debouncedQuery);
        }
    }, [filters, debouncedQuery, performSearch]);

    return (
        <main className="search-page" aria-label="Search Recipes">
            <div className="container">
                <header className="search-header">
                    <h1 className="search-title">🔍 Search Recipes</h1>
                </header>

                <section className="search-controls">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search for recipes (min 3 characters)..."
                            value={query}
                            onChange={handleSearchChange}
                            className="search-input"
                            aria-label="Search recipes"
                            disabled={isLoading}
                        />
                        {isLoading && <span className="loading-indicator">Searching...</span>}
                    </div>

                    <div className="search-filters">
                        <div className="filter-group">
                            <label htmlFor="sortBy">Sort by:</label>
                            <select
                                id="sortBy"
                                name="sortBy"
                                value={filters.sortBy}
                                onChange={handleFilterChange}
                                className="filter-select"
                            >
                                <option value="relevance">Relevance</option>
                                <option value="date">Newest</option>
                                <option value="popularity">Popularity</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label htmlFor="category">Category:</label>
                            <select
                                id="category"
                                name="category"
                                value={filters.category}
                                onChange={handleFilterChange}
                                className="filter-select"
                            >
                                <option value="all">All</option>
                                <option value="breakfast">Breakfast</option>
                                <option value="lunch">Lunch</option>
                                <option value="dinner">Dinner</option>
                                <option value="dessert">Dessert</option>
                            </select>
                        </div>
                    </div>
                </section>

                <section className="search-results" aria-live="polite">
                    {error ? (
                        <div className="error-message" role="alert">
                            {error}
                            <button
                                className="retry-btn"
                                onClick={() => performSearch(debouncedQuery)}
                            >
                                Retry
                            </button>
                        </div>
                    ) : isLoading && query.length > 2 ? (
                        <div className="loading-spinner">Loading results...</div>
                    ) : results.length === 0 ? (
                        <p className="no-results">
                            {query.length <= 2
                                ? "Please enter at least 3 characters to search."
                                : "No recipes found. Try a different search term!"}
                        </p>
                    ) : (
                        <div className="recipe-grid">
                            {results.map((recipe) => (
                                <RecipeCard
                                    key={recipe._id}
                                    recipe={recipe}
                                    className="recipe-card"
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}