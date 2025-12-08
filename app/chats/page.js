"use client";
import { useEffect, useState } from "react";
import "./chat-style.css";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSettings, setOpenSettings] = useState(false);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/chats");
        const data = await res.json();
        console.log("API chats: ", data);
        setChats(data.chats || []);
      } catch (error) {
        console.log("Error fetching chat:", error);
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
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  if (chats.length === 0) {
    return <h2 style={{ textAlign: "center" }}>No Chats....</h2>;
  }

  return (
    <div className="chats-page">
      <h1 className="chats-title">Chats</h1>

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
            <div className="settings-menu-toChats">
              <a href="/chats">Chats</a>
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

      <div className="chats-card">
        {chats.map((c) => (
          <div
            key={c.id}
            className="chat-match"
            onClick={() => router.push(`/chats/${c.id}`)}
          >
            <img
              src={c.photo_url}
              alt="Dog Owner-Dog"
              className="chat-photo"
            />
            <p>{c.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
