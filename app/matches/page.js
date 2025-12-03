"use client";
import "./matches-style.css";
import { useEffect, useState, useCallback } from "react";
import { pre } from "framer-motion/client";

export default function MatchesPage(){

  // We use useState() to avoid errors while data is still loading.
  const[matches, setMatches] = useState([]);
  const[loading, setLoading] = useState(true);
  const[matchChat, setMatchChat] = useState(null);
  const [openSettings, setOpenSettings] = useState(false);

  // Fetch matches 
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/matches");
        const data = await res.json();
        setMatches(data.matches || []);
      } catch (error) {
        console.log("Error fetching matches: ", error);
      }finally{
        setLoading(false); 
        // Finally will always run, no matter if there is an API problem or not.
        // It will stop showing "Loading..." on screen.
      }
    })();
  }, []);

  if(loading){
    return <p style={{textAlign: "center"}}>Loading...</p>
  }

  if(matches.length === 0){
    return <p style={{textAlign: "center"}}>No matches yet...</p>
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUserId");
    router.push("/auth/login");
  };

  const openChat = (m) => {
    console.log(matches);
    setMatchChat(m);
  }

  const closeChat = () => {
    setMatchChat(null);
  }


  return (
    <div className="matches-page">
      <h2>Matches</h2>

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

      <div className="matches-box">
        {matches.map((m) => (
          <div className="match-card" key={m.user_id}>
            <img
              src={m.photo_url}
              alt="Owner-Dog photo"
              style={{ width: "80px", height: "80px", borderRadius: "10px" , cursor: "pointer"}}
              onClick={() => openChat(m)}
            />
            <h3>{m.username}</h3>
            <p>{m.dog_name}, {m.dog_breed}</p>
          </div>
        ))}


      {matchChat &&(
        <>
          <div className="matches-chat">
            <div className="matches-chat-top">
              <h3>{matchChat.username}</h3>
              <button className="close-btn">X</button>
            </div>

            <div className="matches-chat-conversation">
              <input type="text" placeholder="Type something..."></input>
              <button onClick={closeChat}>Send</button>
            </div>
          </div>
        </>
      )}

      </div>
    </div>
  );
}