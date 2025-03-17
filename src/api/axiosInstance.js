import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: { "Content-Type": "application/json" },
});

// Attach Token to Requests if User is Logged In
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Handle Invalid Token Responses
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token is invalid or expired
            localStorage.removeItem("token"); // Clear the invalid token
            window.location.href = "/login"; // Redirect to login page
        }
        return Promise.reject(error);
    }
);

/* ========================
    🛠️ AUTHENTICATION REQUESTS
======================== */
// Login User
export const loginUser = async (credentials) => {
    try {
        const response = await API.post("/auth/login", credentials);
        if (response.data.token) {
            localStorage.setItem("token", response.data.token); // Store the token
        }
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};

// Register User
export const registerUser = async (userData) => {
    try {
        const response = await API.post("/auth/register", userData);
        return response.data;
    } catch (error) {
        console.error("Error registering user:", error.response?.data || error.message);
        throw error;
    }
};

// Logout User (Remove token)
export const logoutUser = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; // Redirect to home page
};

/* ========================
    👤 USER PROFILE REQUESTS
======================== */
// Fetch User Profile
export const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.warn("No token found, skipping profile fetch.");
        return null;  // Return null instead of making an API call
    }

    try {
        const response = await API.get("/users/profile");
        return response.data;
    } catch (error) {
        console.error("Error fetching user profile:", error.response?.data || error.message);
        return null;
    }
};


// Update User Profile
export const updateUserProfile = async (updatedUser) => {
    try {
        const response = await API.put("/users/profile", updatedUser);
        return response.data;
    } catch (error) {
        console.error("Error updating user profile:", error.response?.data || error.message);
        throw error;
    }
};

// Check Username Availability
export const checkUsernameAvailability = async (username) => {
    try {
        const response = await API.get(`/users/check-username/${username}`);
        return response.data;
    } catch (error) {
        console.error("Error checking username availability:", error.response?.data || error.message);
        throw error;
    }
};

/* ========================
    🏠 HOME PAGE REQUESTS
======================== */
// Fetch all recipes
export const fetchRecipes = async () => {
    try {
        const response = await API.get("/recipes");
        return response.data;
    } catch (error) {
        console.error("Error fetching recipes:", error.response?.data || error.message);
        throw error;
    }
};

// Fetch trending recipes
export const fetchTrendingRecipes = async () => {
    try {
        const response = await API.get("/recipes/trending");
        return response.data;
    } catch (error) {
        console.error("Error fetching trending recipes:", error.response?.data || error.message);
        throw error;
    }
};

// Fetch recent recipes
export const fetchRecentRecipes = async () => {
    try {
        const response = await API.get("/recipes/recent");
        return response.data;
    } catch (error) {
        console.error("Error fetching recent recipes:", error.response?.data || error.message);
        throw error;
    }
};

/* ========================
    🆕 NEW POST REQUESTS
======================== */
// Create a new recipe
export const createRecipe = async (recipeData) => {
    try {
        const response = await API.post("/recipes", recipeData);
        return response.data;
    } catch (error) {
        console.error("Error creating recipe:", error.response?.data || error.message);
        throw error;
    }
};

// Save a recipe as draft
export const saveDraftRecipe = async (recipeData) => {
    try {
        const response = await API.post("/recipes/draft", recipeData);
        return response.data;
    } catch (error) {
        console.error("Error saving draft recipe:", error.response?.data || error.message);
        throw error;
    }
};

/* ========================
    🔎 SEARCH REQUESTS
======================== */
// Search recipes with query
export const searchRecipes = async (query, recipeType, sortBy, page = 1, limit = 10) => {
    try {
        const response = await API.get("/recipes/search", {
            params: { query, recipeType, sortBy, page, limit },
        });
        return response.data;
    } catch (error) {
        console.error("Error searching recipes:", error.response?.data || error.message);
        throw error;
    }
};

/* ========================
    ❤️ LIKE & SAVE REQUESTS
======================== */
// Like a recipe
export const likeRecipe = async (recipeId) => {
    try {
        const response = await API.post(`/recipes/${recipeId}/like`);
        return response.data;
    } catch (error) {
        console.error("Error liking recipe:", error.response?.data || error.message);
        throw error;
    }
};

// Unlike a recipe
export const unlikeRecipe = async (recipeId) => {
    try {
        const response = await API.post(`/recipes/${recipeId}/unlike`);
        return response.data;
    } catch (error) {
        console.error("Error unliking recipe:", error.response?.data || error.message);
        throw error;
    }
};

// Save a recipe
export const saveRecipe = async (recipeId) => {
    try {
        const response = await API.post(`/recipes/${recipeId}/save`);
        return response.data;
    } catch (error) {
        console.error("Error saving recipe:", error.response?.data || error.message);
        throw error;
    }
};

// Remove a saved recipe
export const removeSavedRecipe = async (recipeId) => {
    try {
        const response = await API.post(`/recipes/${recipeId}/remove-saved`);
        return response.data;
    } catch (error) {
        console.error("Error removing saved recipe:", error.response?.data || error.message);
        throw error;
    }
};

/* ========================
    🛠️ RECIPE DETAILS REQUESTS
======================== */
// Fetch a single recipe by ID
export const fetchRecipeById = async (recipeId) => {
    try {
        const response = await API.get(`/recipes/${recipeId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching recipe:", error.response?.data || error.message);
        throw error;
    }
};

// Add a review to a recipe
export const addReview = async (recipeId, reviewData) => {
    try {
        const response = await API.post(`/recipes/${recipeId}/review`, reviewData);
        return response.data;
    } catch (error) {
        console.error("Error adding review:", error.response?.data || error.message);
        throw error;
    }
};

// Delete a recipe
export const deleteRecipe = async (recipeId) => {
    try {
        const response = await API.delete(`/recipes/${recipeId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting recipe:", error.response?.data || error.message);
        throw error;
    }
};

export default API;