"use client";
import "./matches-style.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MatchesPage(){

  const[matches, setMatches] = useState([]);
  const[loading, setLoading] = useState(true);
  const [openSettings, setOpenSettings] = useState(false);
  const router = useRouter();

  // Fetch matches 
  useEffect(() => {
    const stored = localStorage.getItem("currentUserId");

    if(!stored){
      router.push("/auth/login");
    }

    (async () => {
      try {
        const res = await fetch("/api/matches");
        const data = await res.json();
        setMatches(data.matches || []);
      } catch (error) {
        console.log("Error fetching matches: ", error);
      }finally{
        setLoading(false); 
      }
    })();
  }, []);

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

  if(loading){
    return (
    <>
    {Settings}
    <h2 style={{ textAlign: "center" }}>Loading...</h2>;
    </>
    )
  }

  if(matches.length === 0){
    return (
    <>
    {Settings}
    <h2 style={{ textAlign: "center" }}>Matches will appear here. Whenever there is a mutual like with another user, a match will be created.</h2>;
    </>
    )
  }


  const handleCreateMeetingFlow = (userId) => {
    router.push(`/meetings/create/${userId}`);
  };



  return (
    <div className="matches-page">
      <h2>Matches</h2>

      {Settings}
      <div className="matches-box">
        {matches.map((m) => (
          <div className="match-card" key={m.user_id} onClick={() => handleCreateMeetingFlow(m.user_id)}>
            <img
              src={m.photo_url}
              alt="Owner-Dog photo"
              style={{ width: "80px", height: "80px", borderRadius: "10px" , cursor: "pointer"}}
            />
            <h3>{m.username}</h3>
            <p>{m.dog_name}, {m.dog_breed}</p>
          </div>
        ))}
      </div>
    </div>
  );
}