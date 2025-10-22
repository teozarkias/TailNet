"use client";
import "./main-style.css"
import { useEffect, useState } from "react";
import { motion, useMotionValue, useAnimation } from "framer-motion";

export default function MainPage(){

  const [users, setUsers] = useState([]);
  const [index, setIndex] = useState(0);
  const currentUserId = 1;

  const x = useMotionValue(0);
  const controls = useAnimation();

  // Fetching users 
  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch(`/api/users?exclude=${currentUserId}`);
      const data = await res.json();
      setUsers(data.users || []);
    }
    fetchUsers();
  // Dependency array
  }, []);


  const handleLike = () => {
    controls.start({ x: 500, opacity: 0 }).then(() => {
    setIndex(prev => prev + 1);
    controls.set({ x: 0, opacity: 1 });
    });
  };

  const handleDislike = () => {
    controls.start({ x: -500, opacity: 0 }).then(() => {
      setIndex(prev => prev + 1);
      controls.set({ x: 0, opacity: 1 });
    });
  };



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

  return (
    <div className="main-page">
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
          <button className="like" onClick={handleLike}>❤️</button>
          <button className="dislike" onClick={handleDislike}>✖️</button>
        </div>
      </motion.div>
    </div>
  );

}
