"use client";
import "./profile-style.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSettings, setOpenSettings] = useState(false);
  const router = useRouter();

  // Prevents scrolling (couldnt through css for some reason)
  useEffect(() => {
    const html = document.documentElement;

    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;

    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      html.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, []);
  
  useEffect(() => {
    const currentUserId = localStorage.getItem("currentUserId");

    if (!currentUserId) {
      router.push("/auth/login");
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


  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
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

            <div className="setting-menu-toMain">
              <a href="/main">Main</a>
            </div>

            <div className="setting-menu-toLikedDisliked">
              <a href="/interactions">Interactions</a>
            </div>

            <div className="settings-menu-toMatches">
              <a href="/matches">Matches</a>
            </div>

            <div className="settings-menu-toMeetings">
              <a href="/meetings">Meetings</a>
            </div>
            
            <div className="settings-menu-toChats">
              <a href="/chats">Chats</a>
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
