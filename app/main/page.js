"use client";
import "./main-style.css"
import { useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useAnimation } from "framer-motion";
import { pre } from "framer-motion/client";

export default function MainPage(){

  const [users, setUsers] = useState([]);
  const [index, setIndex] = useState(0);
  const currentUserId = 1;

  const x = useMotionValue(0);
  const controls = useAnimation();
  const [openSettings, setOpenSettings] = useState(false);
  // Fetching users 
  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch(`/api/users?exclude=${currentUserId}`);
      const data = await res.json();
      setUsers(data.users || []);
    }
    fetchUsers();
  // Dependency array [] (runs things once, not after every render) 
  // (prevents lags, too many API requests, infinite loops possibly)
  }, []);


  const SWIPE_DISTANCE = 500;
  const [isAnimating, setIsAnimating] = useState(false);

  const controlsStart = useCallback(async (direction) => {
    if (isAnimating) return;
    setIsAnimating(true);
    try {
      await controls.start({
        x: direction,
        opacity: 0,
        transition: { duration: 0.25 }
      });
      setIndex((prev) => prev + 1);
      controls.set({ x: 0, opacity: 1 });
    } finally {
      setIsAnimating(false);
    }
  }, [controls, isAnimating]);

  const handleLike = () => controlsStart(+SWIPE_DISTANCE);
  const handleDislike = () => controlsStart(-SWIPE_DISTANCE);

  if(users.length === 0){
    return <h2 style={{textAlign:"center"}}>Loading profiles...</h2>;
  }

  if(index >= users.length){
    return <h2 style={{textAlign:"center"}}>No more users around</h2>;
  }

  const user = users[index];

  const handleDragEnd = (_, info) => {
    if (info.offset.x > 120) {
      // Swipe Right = Like
      handleLike();
    } else if (info.offset.x < -120) {
      // Swipe Left = Dislike
      handleDislike();
    } else {
      // Not enough swipe → snap back
      controls.start({ x: 0, rotate: 0 });
    }
  };

  handleLogout = () => {
    
  }


  return (
    <div className="main-page">
      <div className="settings">
        <button
          className="settings-button"
          aria-label="Open settings"
          aria-expanded={openSettings}
        > 🐾 </button>

      {openSettings && (
        <>
          <div className="settings-menu">
            <div className="setting-menu-toLikedDisliked">
              <a href="/liked-disliked"></a>
            </div>

            <div className="settings-menu-toMatches">
              <a href="/matches"></a>
            </div>

            <div className="settings-menu-toProfile">
              <a href="/users"></a>
            </div>

            <hr></hr>

            <div className="setting-menu-Logout">
              <button
                className="logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </>
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
        <p>Owner: {user.fullname}, {user.age}</p>

        <div className="buttons-box">
          <button className="dislike" onClick={handleDislike} disable={isAnimating}>✖️</button>
          <button className="like" onClick={handleLike} disable={isAnimating}>❤️</button>
        </div>
      </motion.div>
    </div>
  );

}
