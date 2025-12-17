"use client";
import "./meetings-style.css";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

function formatWhen(value) {
  if (!value) return "";

  // value is expected to be an ISO-ish string from <input type="datetime-local" />
  // Example: 2025-12-20T18:00
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;

  return d.toLocaleString();
}

export default function MeetingsPage() {
  const router = useRouter();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSettings, setOpenSettings] = useState(false);
  const [me, setMe] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("currentUserId");
    if (!stored) {
      router.push("/auth/login");
      return;
    }
    setMe(Number(stored));

    (async () => {
      try {
        const res = await fetch("/api/meetings");
        const data = await res.json();
        setMeetings(data.meetings || []);
      } catch (e) {
        console.log("Error fetching meetings:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const incomingPending = useMemo(() => {
    if (!me) return [];
    return meetings.filter((m) => Number(m.invited_id) === me && m.status === "pending");
  }, [meetings, me]);

  const outgoing = useMemo(() => {
    if (!me) return [];
    return meetings.filter((m) => Number(m.creator_id) === me);
  }, [meetings, me]);

  const handleLogout = () => {
    localStorage.removeItem("currentUserId");
    router.push("/auth/login");
  };

  const handleRespond = async (meetingId, status) => {
    setBusyId(meetingId);
    try {
      const res = await fetch(`/api/meetings/${meetingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to update meeting");
        return;
      }

      // Refresh list
      const listRes = await fetch("/api/meetings");
      const listData = await listRes.json();
      setMeetings(listData.meetings || []);
    } catch (e) {
      console.log(e);
      alert("Network error");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div className="meetings-page">
      <h2>Meetings</h2>

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
      <p className="small-note">
        When someone schedules a meeting with you, it appears here as <b>pending</b>.
      </p>

      {meetings.length === 0 ? (
        <p style={{ color: "white" }}>No meetings yet...</p>
      ) : (
        <div className="meetings-box">
          {meetings.map((m) => {
            const isInvited = me && Number(m.invited_id) === me;
            const showActions = isInvited && m.status === "pending";

            return (
              <div className="meeting-card" key={m.meeting_id}>
                <img
                  src={m.other_photo_url || "/dog.png"}
                  alt="User photo"
                />

                <div className="meeting-info">
                  <h3>{m.other_username || "User"}</h3>
                  <p>
                    <b>When:</b> {formatWhen(m.meeting_time)}
                    <br />
                    <b>Where:</b> {m.place}
                  </p>
                  <span className="badge">{m.status}</span>
                </div>

                {showActions && (
                  <div className="actions">
                    <button
                      className="btn btn-accept"
                      disabled={busyId === m.meeting_id}
                      onClick={() => handleRespond(m.meeting_id, "accepted")}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-reject"
                      disabled={busyId === m.meeting_id}
                      onClick={() => handleRespond(m.meeting_id, "rejected")}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
