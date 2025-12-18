"use client";
import "../profile-style.css";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function OtherProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSettings, setOpenSettings] = useState(false);
  const router = useRouter();

  const { profileId } = useParams();
  console.log("Dynamic profileId from URL:", profileId);

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
    const stored = localStorage.getItem("currentUserId");

    if(!stored){
      router.push("/auth/login");
    }

    (async () => {
      try {
        const res = await fetch(`/api/profile?user_id=${profileId}`);
        const data = await res.json();
        console.log("API /api/profile response for other user:", data);
        setProfile(data.profile || null);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [profileId]);


  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/auth/login");
  };
  
  const Settings = (
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

            <div className="settings-menu-toChats">
              <a href="/chats">Chats</a>
            </div>
            
            <div className="settings-menu-toMeetings">
              <a href="/meetings">Meetings</a>
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
  )


  if (loading) {
    return (
    <>
    {Settings}
    <h2 style={{ textAlign: "center" }}>Loading...</h2>;
    </>
    )
  }


  if (!profile) {
    return (
    <>
    {Settings}
    <h2 style={{ textAlign: "center" }}>Profile not found!</h2>;
    </>
    )
  }

  return (
    <div className="profile-page">

      {Settings}
      <img src={profile.photo_url} className="profile-image" alt="User and dog" />
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
