"use client";

import { useEffect, useState } from "react";

export default function MainPage(){

  const [users, setUsers] = useState([]);
  const [index, setIndex] = useState(0);
  const currentUserId = 1;

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
    alert(`Liked: ${users[index].username}`);
    setIndex((prev) => prev + 1);
  }

  const handleDislike = () => {
    alert(`Disliked: ${users[index].username}`);
    setIndex((prev) => prev + 1);
  }


  if(users.length === 0){
    return <h2 style={{textAlign:"center"}}>Loading profiles...</h2>;
  }

  if(index >= users.length){
    return <h2 style={{textAlign:"center"}}>No more users around</h2>;
  }

  const user = users[index];

  return(
    <div className="main-page">
      <div className="card">
        <h2>{user.username}</h2>  <hr></hr>
        <img
          src={user.photo_url}
          alt="User n Dog Pic"
          className="card-photo"
        ></img>

        <hr></hr>

        <h2>
          {user.dog_name}
        </h2>

        <p>
          {user.dog_breed}
        </p>

        <p>
          Owner: {user.fullname}, {user.age}
        </p>

        <div className="buttons-box">
          <button className="like" onClick={handleLike}>❤️</button>
          <button className="dislike" onClick={handleDislike}>✖️</button>
        </div>
      </div>
    </div>
  );
}
