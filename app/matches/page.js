"use client";
import { useEffect, useState, useCallback } from "react";
import { pre } from "framer-motion/client";

export default function MatchesPage(){

  const[matches, setMatches] = useState([]); // We use useState([]) to avoid errors while data is still loading.
  const[loading, setLoading] = useState(true);

  // Fetch matches 
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/matches");
        const data = await res.json();
        setMatches(data.matches || []);
      } catch (error) {
        console.log("Error fetching matches: ", error);
      }finally{
        setLoading(false); 
        // Finally will always run, no matter if there is an API problem or not.
        // It will stop showing "Loading..." on screen.
      }
    })();
  }, []);

  if(loading){
    return <p style={{textAlign: "center"}}>Loading...</p>
  }

  if(matches.length === 0){
    return <p style={{textAlign: "center"}}>No matches yet...</p>
  }



  return (
    <div className="matches-page">
      <h2>Matches</h2>

      <div className="matches-box">
        {matches.map((m) => (
          <div className="match-card" key={m.id}>
            <img
              src={m.photo_url}
              alt="Owner-Dog photo"
              style={{ width: "80px", height: "80px", borderRadius: "10px" }}
            />
            <div>
              <h3>{m.username}</h3>
              <p>{m.dog_name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}