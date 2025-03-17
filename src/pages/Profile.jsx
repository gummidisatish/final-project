import { useState, useEffect } from "react";
import { fetchUserProfile, updateUserProfile } from "../api/axiosInstance";
import "../styles.css";

export default function Profile() {
    const [user, setUser] = useState({});
    const [editing, setEditing] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({});

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const data = await fetchUserProfile();
                setUser(data);
                setUpdatedUser(data);
            } catch (error) {
                console.error("Error fetching user profile:", error);
                // Redirect to login if token is invalid
                if (error.response?.status === 401) {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                }
            }
        };
        loadUserProfile();
    }, []);
    const handleChange = (e) => {
        setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            await updateUserProfile(updatedUser);
            setUser(updatedUser);
            setEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <div className="profile-container">
            <button className="back-button" onClick={() => window.history.back()}>⬅ Back</button>
            <h2 className="profile-title">My Profile</h2>

            <div className="profile-image-container">
                <img src={user.profileImage || "/default-profile.jpg"} alt="Profile" className="profile-image" />
            </div>

            {editing ? (
                <div className="profile-edit-form">
                    <div className="form-group">
                        <label>Full Name:</label>
                        <input type="text" name="fullName" value={updatedUser.fullName} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Username:</label>
                        <input type="text" name="username" value={updatedUser.username} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input type="email" name="email" value={updatedUser.email} onChange={handleChange} disabled />
                    </div>
                    <div className="form-group">
                        <label>Profile Image URL:</label>
                        <input type="text" name="profileImage" value={updatedUser.profileImage} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Bio:</label>
                        <textarea name="bio" value={updatedUser.bio} onChange={handleChange}></textarea>
                    </div>
                    <div className="profile-buttons">
                        <button onClick={handleUpdate} className="btn btn-success">Save Changes</button>
                        <button onClick={() => setEditing(false)} className="btn btn-secondary">Cancel</button>
                    </div>
                </div>
            ) : (
                <div className="profile-details">
                    <p><strong>Full Name:</strong> {user.fullName}</p>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Bio:</strong> {user.bio || "No bio added."}</p>
                    <button onClick={() => setEditing(true)} className="btn btn-primary">Edit Profile</button>
                </div>
            )}
        </div>
    );
}