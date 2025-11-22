"use client";
import "./main-style.css";
import { useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useAnimation } from "framer-motion";
import { useRouter } from "next/navigation";

export default function MainPage() {

  // Users
  const [users, setUsers] = useState([]);
  const [index, setIndex] = useState(0);
  const [currentId, setCurrentId] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Animation 
  const [isAnimating, setIsAnimating] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const x = useMotionValue(0);
  const controls = useAnimation();

  // Route Helper
  const router = useRouter();

  useEffect(() => {
    const id = localStorage.getItem("currentUserId");

    if (!id) {
      router.push("/auth/login");
      return;
    }

    setCurrentId(id);
  }, [router]);

  // Fetch users once we know currentId
  useEffect(() => {
    if (!currentId) return;

    async function fetchUsers() {
      try {
        const res = await fetch(`/api/main?exclude=${currentId}`);
        const data = await res.json();
        setUsers(data.users || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoadingUsers(false);
      }
    }

    fetchUsers();
  }, [currentId]);


  // Start of animation
const SWIPE_DISTANCE = 500;

const controlsStart = useCallback(
  async (direction) => {
    // don't start if already animating
    if (isAnimating) return;

    // make sure we actually have a card here
    if (!users.length || index >= users.length) return;

    const currentCard = users[index];

    // depending on your API, this might be `currentCard.id`
    const targetUserId = currentCard.id ?? currentCard.user_id;
    const interaction = direction > 0 ? "like" : "dislike";

    setIsAnimating(true);

    try {
      // save interaction
      fetch("/api/interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId, interaction }),
      }).catch((err) => {
        console.error("Failed to save interaction:", err);
      });

      // animate swipe
      await controls.start({
        x: direction,
        opacity: 0,
        transition: { duration: 0.25 },
      });

      // move to next card
      setIndex((prev) => prev + 1);
      controls.set({ x: 0, opacity: 1 });
    } finally {
      setIsAnimating(false);
    }
  },
  // include `users` and `index` so the callback sees fresh values
  [controls, isAnimating, users, index]
);

  const handleLike = () => controlsStart(+SWIPE_DISTANCE);
  const handleDislike = () => controlsStart(-SWIPE_DISTANCE);

  const handleDragEnd = (_, info) => {
    if (info.offset.x > 120) {
      handleLike();
    } else if (info.offset.x < -120) {
      handleDislike();
    } else {
      controls.start({ x: 0, rotate: 0 });
    }
  };
  // End of animation


  const handleLogout = () => {
    localStorage.removeItem("currentUserId");
    router.push("/auth/login");
  };


  if (loadingUsers) {
    return (
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
  }

  if (!users.length || index >= users.length) {
    return (
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
  }

  const user = users[index];

  return (
    <div className="main-page">
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

      <motion.div
        className="card"
        drag="x"
        style={{ x }}
        animate={controls}
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        whileDrag={{ rotate: x.get() / 20 }}
      >
        <h2>{user.username}</h2>
        <hr />
        <img
          src={user.photo_url}
          alt="User n Dog Pic"
          className="card-photo"
        />
        <hr />

        <h2>{user.dog_name}</h2>
        <p>{user.dog_breed}</p>
        <p>
          Owner: {user.fullname}, {user.age}
        </p>

        <div className="buttons-box">
          <button
            className="dislike"
            onClick={handleDislike}
            disabled={isAnimating}
          >
            ✖️
          </button>
          <button
            className="like"
            onClick={handleLike}
            disabled={isAnimating}
          >
            ❤️
          </button>
        </div>
      </motion.div>
    </div>
  );
}
