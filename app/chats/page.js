"use client";
import { useEffect, useState } from "react";
import "./chat-style.css";

export default function ChatPage() {

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  if (chats.length === 0) {
    return <h2 style={{ textAlign: "center" }}>No Chats....</h2>;
  }

  return (
    <div className="chats-page">
      <h1 className="chats-title">Chats</h1>

      <div className="chats-card">
        {chats.map((c) => (
          <div key={c.id} className="chat-match">
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
