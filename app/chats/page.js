"use client";
import { useEffect, useState } from "react";
import "./chat-style.css";
import Link from "next/link";
import { fetchExternalImage } from "next/dist/server/image-optimizer";


function getConversationId(userId1, userId2){
  const [a, b] = [userId1, userId2].sort();
  return `${a}_${b}`;
}


export default function ChatPage({likes, currentUserId}) {

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/chats");
        const data = await res.json();

        console.log("API chats: ", data);
        setChats(data || []);
      } catch (error) {
        console.log("Error fetching chat:", error);
      } finally {
        setLoading(false);
      }
    }) ();
  }, []);

  if(chats.length === 0){
    return <h2 style={{textAlign: "center"}}>No Chats....</h2>;
  }

  if(loading){
    return <h2 style={{textAlign: "center"}}>Loading...</h2>;
  }

  return (
    <div>
      <h1>Chats</h1>

      {chats.length === 0 && <p>No chats yet.</p>}

      {chats.map((c) => (
        <div key={c.id}>
          <p>{c.username}</p>
        </div>
      ))}
    </div>
  );
} 