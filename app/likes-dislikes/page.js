"use client";
import { useEffect, useState, useCallback } from "react";

export default function LikesDislikes(){

  const [likesDislikes, setLikesDislikes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch LikedDisliked
  useEffect(() => {
    (async () => {
        try {
          const res = await fetch("/api/liked-disliked");
          const data = await res.json();
          setLikesDislikes(data.likesDislikes || []);
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

  if(likesDislikes.length === 0){
    return <p style={{textAlign: "center"}}>No likes or dislikes yet...</p>
  }


  return(
    <></>
  )
} 