"use client";
import { useEffect, useState, useCallback } from "react";

export default function LikesDislikes(){

  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch LikesDislikes
  useEffect(() => {
    (async () => {
        try {
          const res = await fetch("/api/liked-disliked");
          const data = await res.json();
          setLikes(data.likes || []);
          setDislikes(data.dislikes || []);
        } catch (error) {
          console.log("Error fetching likes-dislikes:", error);
        }finally{
          setLoading(false);
        }
    })();
  }, []);

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
    <div className="likesDislikes-page">
      <h2>Likes-Dislikes</h2>

      <div className="likesDislikes-box">

        {likes.map((l) => (
          <div className="likesDislikes-box">
            <div className="likes-box" key={l.id}>
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