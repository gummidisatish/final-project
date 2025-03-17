import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchUserProfile } from "../api/axiosInstance";
import ProfilePopupMenu from "./ProfilePopupMenu";
import "../styles.css";

export default function Navbar({ isLoggedIn }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUserProfile = async () => {
            if (isLoggedIn) {
                try {
                    const data = await fetchUserProfile();
                    setUser(data);
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                }
            }
        };
        loadUserProfile();
    }, [isLoggedIn]);

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
                {/* Left Section - Navigation Links */}
                <div className="d-flex align-items-center">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item"><Link className="nav-link" to="/home">Home</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/trending">Trending</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/about">About Us</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Center - Logo */}
                <Link className="navbar-brand mx-auto" to="/">
                    <img src="/recipe-logo.jpg" className="recipe-logo-settings" alt="Recipe Logo" />
                </Link>

                {/* Right Section - Search & Profile */}
                <div className="d-flex align-items-center">
                    <i className="fas fa-search search-icon me-3" onClick={() => window.location.href = "/search"}></i>
                    {isLoggedIn ? <ProfilePopupMenu user={user} /> : <Link className="btn btn-outline-success" to="/login">Login</Link>}
                </div>
            </div>
        </nav>
    );
}