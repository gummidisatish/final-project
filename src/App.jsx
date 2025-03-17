import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Trending from "./pages/Trending";
import Recent from "./pages/Recent";
import About from "./pages/About";
import NewPost from "./pages/NewPost";
import Profile from "./pages/Profile";
import Published from "./pages/Published";
import Liked from "./pages/Liked";
import Saved from "./pages/Saved";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import Recipe from "./pages/Recipe";
import "./styles.css";

export default function App() {
    const isLoggedIn = !!localStorage.getItem("token");

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<Home />} />
                <Route path="/trending" element={<Trending />} />
                <Route path="/recent" element={<Recent />} />
                <Route path="/about" element={<About />} />
                <Route path="/search" element={<Search />} />
                <Route path="/recipe/:id" element={<Recipe />} />

                {/* Protected Routes */}
                <Route
                    path="/newpost"
                    element={isLoggedIn ? <NewPost /> : <Navigate to="/login" />}
                />
                <Route
                    path="/profile"
                    element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
                />
                <Route
                    path="/published"
                    element={isLoggedIn ? <Published /> : <Navigate to="/login" />}
                />
                <Route
                    path="/liked"
                    element={isLoggedIn ? <Liked /> : <Navigate to="/login" />}
                />
                <Route
                    path="/saved"
                    element={isLoggedIn ? <Saved /> : <Navigate to="/login" />}
                />

                {/* Authentication */}
                <Route
                    path="/login"
                    element={isLoggedIn ? <Navigate to="/home" /> : <Login />}
                />
                <Route
                    path="/register"
                    element={isLoggedIn ? <Navigate to="/home" /> : <Register />}
                />
                <Route path="/logout" element={<Logout />} />

                {/* 404 Page */}
                <Route path="*" element={<h2 className="container text-center mt-5">404 - Page Not Found</h2>} />
            </Routes>
        </Router>
    );
}