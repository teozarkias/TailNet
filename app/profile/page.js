"use client";
import "./profile-style.css";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading profile...</p>;
  }

  if (!profile) {
    return <p style={{ textAlign: "center" }}>No profile found...</p>;
  }

  return (
    <div className="profile-page">
      <img
        src={profile.photo_url}
        alt="User-and-dog"
        className="profile-image"
      />

      <h2>{profile.username}</h2>

      <p>
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
