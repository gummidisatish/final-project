import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { fetchRecentRecipes } from "../api/axiosInstance";
import "../styles.css";

export default function Recent() {
    const [recentRecipes, setRecentRecipes] = useState([]);

    useEffect(() => {
        const loadRecentRecipes = async () => {
            try {
                const data = await fetchRecentRecipes();
                setRecentRecipes(data);
            } catch (error) {
                console.error("Error fetching recent recipes:", error);
            }
        };
        loadRecentRecipes();
    }, []);

    return (
        <>
            <Navbar isLoggedIn={!!localStorage.getItem("token")} />
            <main className="container mt-5">
                <h2>📅 Recent Recipes</h2>
                <p>Discover the newest recipes added.</p>
            </main>
        </>
    );
}
