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
        const data = await req.json();
        setMatches(data.matches || []);
      } catch (error) {
        console.log("Error fetching matches: ", error);
      }finally{
        setLoading(false); 
        // Finally will always run, no matter if there is an API problem or not.
        // It will stop showing "Loading..." on screen.
      }
    })();
  }, [])



  return(
    <div className="matches-page">
      <h2>Matches</h2>
      <div className="matches-box">
        
      </div>
    </div>
  )
}