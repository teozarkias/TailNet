"use client";
import "./main-style.css";
import { useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useAnimation } from "framer-motion";
import { useRouter } from "next/navigation";

export default function MainPage() {
  const [users, setUsers] = useState([]);
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const x = useMotionValue(0);
  const controls = useAnimation();
  const router = useRouter();

  // Read current user from localStorage
  useEffect(() => {
    const id = localStorage.getItem("currentUserId");

    if (!id) {
      // Not logged in → go back to login
      router.push("/auth/login"); // or "/login" depending on your route
      return;
    }

    setCurrentId(id);
  }, [router]);

  // Fetch users once we know currentId
  useEffect(() => {
    if (!currentId) return;

    async function fetchUsers() {
      try {
        const res = await fetch(`/api/users?exclude=${currentId}`);
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

  const SWIPE_DISTANCE = 500;

  const controlsStart = useCallback(
    async (direction) => {
      if (isAnimating) return;
      setIsAnimating(true);
      try {
        await controls.start({
          x: direction,
          opacity: 0,
          transition: { duration: 0.25 },
        });
        setIndex((prev) => prev + 1);
        controls.set({ x: 0, opacity: 1 });
      } finally {
        setIsAnimating(false);
      }
    },
    [controls, isAnimating]
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

  // 3️⃣ Proper logout: clear localStorage and go to login
  const handleLogout = () => {
    localStorage.removeItem("currentUserId");
    // If you ever add an /api/logout, call it here too
    router.push("/auth/login"); // NOTE the leading slash
  };

  // 4️⃣ Loading / empty states
  if (loadingUsers) {
    return <h2 style={{ textAlign: "center" }}>Loading profiles...</h2>;
  }

  if (!users.length || index >= users.length) {
    return <h2 style={{ textAlign: "center" }}>No more users around</h2>;
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
