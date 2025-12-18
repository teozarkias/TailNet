"use client";

import "../create-style.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateMeetingPage({ params }) {
  const router = useRouter();
  const invitedId = Number(params.userId);

  const [meetingTime, setMeetingTime] = useState("");
  const [place, setPlace] = useState("");
    const [openSettings, setOpenSettings] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("currentUserId");
    if (!stored) router.push("/auth/login");
  }, [router]);

  const submit = async () => {
    if (!meetingTime || !place) {
      alert("Please set a time and a place.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitedId, meetingTime, place }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to create meeting");
        return;
      }

      // After creation, go to meetings page (invited user will see it as pending).
      router.push("/meetings");
    } catch (e) {
      console.log(e);
      alert("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/auth/login");
  };

  return (
    <div className="create-meeting-page">
      <div className="create-meeting-card">
        <h2>Schedule meeting</h2>
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

              <div className="settings-menu-toMain">
                <a href="/main">Main</a>
              </div>

              <div className="settings-menu-toLikedDisliked">
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

        <div className="field">
          <label>Time</label>
          <input
            type="datetime-local"
            value={meetingTime}
            onChange={(e) => setMeetingTime(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Place</label>
          <input
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="e.g. Central Park main entrance"
          />
        </div>

        <div className="row">
          <button className="primary" disabled={submitting} onClick={submit}>
            {submitting ? "Creating..." : "Create meeting"}
          </button>
          <button className="secondary" onClick={() => router.back()}>
            Cancel
          </button>
        </div>

        <p className="hint">
          This will create a <b>pending</b> meeting for the other user. They will see it on the Meetings page.
        </p>
      </div>
    </div>
  );
}
