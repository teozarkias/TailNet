"use client";
import "./interactions-style.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Interactions() {
  const [interactions, setInteractions] = useState([]); // unified list
  const [loading, setLoading] = useState(true);
  const [openSettings, setOpenSettings] = useState(false);

  const router = useRouter();

  // Auth + fetch
  useEffect(() => {
    const stored = localStorage.getItem("currentUserId");

    if (!stored) {
      router.push("/auth/login");
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/interactions");
        const data = await res.json();

        const likes = (data.likes || []).map((u) => ({
          ...u,
          status: "like",
        }));
        const dislikes = (data.dislikes || []).map((u) => ({
          ...u,
          status: "dislike",
        }));

        setInteractions([...likes, ...dislikes]);
      } catch (error) {
        console.log("Error fetching interactions:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);


  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/auth/login");
  };

  const handleProfileView = (userId) => {
    router.push(`/profile/${userId}`);
  };

  // Swipe handler: update local state + API
  const handleSwipe = async (userId, newStatus) => {
    setInteractions((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, status: newStatus } : u
      )
    );

    try {
      await fetch("/api/interactions", {
        method: "POST", // or PUT if your API expects it
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: userId,
          interaction: newStatus, // "like" | "dislike"
        }),
      });
    } catch (err) {
      console.error("Error updating interaction:", err);
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  if (!interactions.length) {
    return <p style={{ textAlign: "center" }}>No interactions yet...</p>;
  }

  return (
    <div className="interactions-page">
      <h2>Interactions</h2>

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

      <div className="interactions-box">
        {interactions.map((u) => {
          const isLike = u.status === "like";

          return (
            <motion.div
              key={u.id}
              className={isLike ? "likes-box" : "dislikes-box"}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragSnapToOrigin
              onDragEnd={(_, info) => {
                if (info.offset.x > 80) {
                  // swipe right -> like
                  handleSwipe(u.id, "like");
                } else if (info.offset.x < -80) {
                  // swipe left -> dislike
                  handleSwipe(u.id, "dislike");
                }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <img
                src={u.photo_url}
                alt="Owner-Dog photo"
                className="interaction-photo"
                onClick={() => handleProfileView(u.id)}
              />
              <div
                className="interaction-text"
                onClick={() => handleProfileView(u.id)}
              >
                <h3>{u.username}</h3>
                <p>
                  {u.dog_name}, {u.dog_breed}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
