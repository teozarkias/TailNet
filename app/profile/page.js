"use client";
import "./profile-style.css";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSettings, setOpenSettings] = useState(false);

  useEffect(() => {
    const currentUserId = localStorage.getItem("currentUserId");

    if (!currentUserId) {
      console.log("No user ID found in localStorage");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`/api/profile?user_id=${currentUserId}`);
        const data = await res.json();
        setProfile(data.profile || null);
      } catch (error) {
        console.log("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUserId");
    router.push("/auth/login");
  };
  
  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading profile...</p>;
  }

  if (!profile) {
    return <p style={{ textAlign: "center" }}>No profile found...</p>;
  }

  return (
    <div className="profile-page">

      <div className="settings">
        <button
          className="settings-button"
          aria-label="Open settings"
          aria-expanded={openSettings}
          onClick={() => setOpenSettings((prev) => !prev)}
        >
          🐾
        </button>

        {openSettings && (
          <div className="settings-menu">
            <div className="setting-menu-toLikedDisliked">
              <a href="/interactions">Interactions</a>
            </div>

            <div className="settings-menu-toMatches">
              <a href="/matches">Matches</a>
            </div>

            <div className="settings-menu-toProfile">
              <a href="/profile">Profile</a>
            </div>

            <hr />

            <div className="setting-menu-Logout">
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
      
      <img
        src={profile.photo_url}
        alt="User-and-dog"
        className="profile-image"
      />

      <h2 className="profile-username">{profile.username}</h2>

      <p className="profile-details">
        <strong>Name:</strong> {profile.fullname} <br />
        <strong>Age:</strong> {profile.age} <br />
        <strong>Sex:</strong> {profile.sex} <br /><br />
        <strong>Dog Name:</strong> {profile.dog_name} <br />
        <strong>Dog Breed:</strong> {profile.dog_breed} <br />
        <strong>Dog Sex:</strong> {profile.dog_sex}
      </p>
    </div>
  );
}
