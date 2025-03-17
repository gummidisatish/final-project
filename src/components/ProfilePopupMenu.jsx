import { Link } from "react-router-dom";
import { logoutUser } from "../api/axiosInstance";

export default function ProfilePopupMenu({ user }) {
    return (
        <div className="dropdown">
            <a href="#" className="profile-toggle" data-bs-toggle="dropdown">
                <img src={user?.profileImage || "/default-profile.jpg"} alt="Profile" className="rounded-circle profile-img" />
            </a>
            <ul className="dropdown-menu dropdown-menu-end">
                <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                <li><Link className="dropdown-item" to="/published">Published</Link></li>
                <li><Link className="dropdown-item" to="/liked">Liked</Link></li>
                <li><Link className="dropdown-item" to="/saved">Saved</Link></li>
                <li><Link className="dropdown-item" to="/change-password">Change Password</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item logout-btn" onClick={logoutUser}>Logout</button></li>
            </ul>
        </div>
    );
}