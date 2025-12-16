"use client";
import "./meetings-style.css"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MeetingsPage(){
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSettings, setOpenSettings] = useState(false);
  const router = useRouter();


  useEffect(() => {
    (async () =>{
      try {
        const res =  await fetch("/api/meetings");

        if (res.status === 401) {
          router.push("/auth/login");
          return;
        } 
        const data = await res.json();
        setMeetings(data.meetings || []);
      } catch (error) {
        console.log("Error fetching meetings: ", error);
      }finally{
        setLoading(false);
      }
    })();
  } ,[]);


  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/auth/login");
  };
  
  // Figured i can save a whole HTML in a variable
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
  )
  
  if(loading){
    return (
      <>
        {Settings}
        <h2 style={{textAlign: "center"}}>Loading...</h2>
      </>
    )
  }

  if(meetings.length === 0){
    return (
    <>
      {Settings}
      <h2 style={{textAlign: "center"}}>No meetings yet...</h2>
    </>
    )
  }

  return(
    <>
      {Settings}
      <div className="meetings-list">
        {meetings.map((m) => (
          <div key={m.meeting_id} className="meeting-card">
            <div>Match: {m.match_id}</div>
            <div>Status: {m.status}</div>
            <div>Time: {m.meeting_time}</div>
            <div>
              Location: {m.lat}, {m.lng}
            </div>
          </div>
        ))}
      </div>
    </>
  );

}