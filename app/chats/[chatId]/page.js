"use client";

import "./chatId-style.css";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [openSettings, setOpenSettings] = useState(false);

  const router = useRouter();
  const params = useParams();
  const chatId = params.chatId;

  // Get current user id from localStorage
  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? localStorage.getItem("currentUserId")
        : null;

    if (stored) {
      setCurrentUserId(Number(stored));
    } else{
      router.push("/auth/login");
    }
  }, []);

  // See if new messages come to auto-scroll
  useEffect(() => {
    const container = document.querySelector(".chat-room-messages");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);


  // Fetch messages + polling
  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages?chatId=${chatId}`);
        const data = await res.json();
        setMessages(data.messages || []);
      } catch (error) {
        console.log("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    const intervalId = setInterval(fetchMessages, 3000);
    return () => clearInterval(intervalId);
  }, [chatId]);

  const sendMessage = async () => {
    const text = newMessage.trim();
    if (!text) return;

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: Number(chatId),
          message: text,
        }),
      });

      if (!res.ok) {
        console.log("Error sending message");
        return;
      }

      const data = await res.json();
      setMessages((prev) => [...prev, data.newMessage]);
      setNewMessage("");
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUserId");
    router.push("/auth/login");
  };

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading....</h2>;
  }

  return (
    <div className="chat-room">

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

      <div className="chat-room-messages">
        {messages.map((m) => {
          const isMine =
            currentUserId !== null && m.sender_id === currentUserId;

          return (
            <div
              key={m.message_id}
              className={`message ${
                isMine ? "message-mine" : "message-theirs"
              }`}
            >
              {!isMine && m.photo_url && (
                <img
                  src={m.photo_url}
                  alt="Dog Owner-Dog"
                  className="message-photo"
                />
              )}

              <div className="message-bubble">
                <div className="message-content">{m.message}</div>
                <div className="message-time">
                  {new Date(m.time_created).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>


      <div className="chat-room-input">
        <input
          type="text"
          placeholder="Type a message…"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
