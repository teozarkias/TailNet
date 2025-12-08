"use client";
import "./interactions-style.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Interactions(){
  
  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSettings, setOpenSettings] = useState(false);

  const router = useRouter();
  // Fetch interactions
  useEffect(() => {
    (async () => {
        try {
          const res = await fetch("/api/interactions");
          const data = await res.json();
          setLikes(data.likes || []);
          setDislikes(data.dislikes || []);
        } catch (error) {
          console.log("Error fetching interactions:", error);
        }finally{
          setLoading(false);
        }
    })();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUserId");
    router.push("/auth/login");
  };


  if(loading){
    return <p style={{textAlign: "center"}}>Loading...</p>
  }

  if(likes.length === 0){
    return <p style={{textAlign: "center"}}>No likes yet...</p>
  }

  if(dislikes.length === 0){
    return <p style={{textAlign: "center"}}>No dislikes yet...</p>
  }




  return(
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

      <div className="interactions-box">

        {likes.map((l) => (
          <div className="interactions-box" key={l.id}>
            <div className="likes-box">
              <img
                src={l.photo_url}
                alt="Owner-Dog photo"
                style={{width: "80px", height: "80px", borderRadius: "10px", color: "#d1ffe7"}}
              />
              <h3>{l.username}</h3>
              <p>{l.dog_name}, {l.dog_breed}</p>
            </div>
          </div>
        ))}

        {dislikes.map((d) => (
          <div className="dislikes-box" key={d.id}>
              <img
                src={d.photo_url}
                alt="Owner-Dog photo"
                style={{width: "80px", height: "80px", borderRadius: "10px", color: "#ffd1d1"}}
              />
              <h3>{d.username}</h3>
              <p>{d.dog_name}, {d.dog_breed}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 