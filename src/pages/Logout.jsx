import { useEffect } from "react";
import { logoutUser } from "../api/axiosInstance";
import "../styles.css";

export default function Logout() {
    useEffect(() => {
        logoutUser();
    }, []);

    return (
        <div className="logout-container">
            <h2>Logging out...</h2>
            <p>You will be redirected shortly.</p>
        </div>
    );
}