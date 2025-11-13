"use client";
import { useState, useEffect } from "react";
import "profile-style.css"
export default function ProfilePage(){

  const currentUserId = 1;
  const[profile, setProfile] = useState([]);
  const[loading, setLoading] = useState(true);

  useEffect(() => {
    (async() => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        setProfile(data.profile || []);
      } catch (error) {
        console.log("Error fetching user info: ", error);
      }finally{
        setLoading(false);
      }
    })();
  }, []);

  if(loading){
    return <p style={{textAlign: "center"}}>Loading profile...</p>
  }

  if(!profile){
    return <p style={{textAlign: "center"}}>No profile found...</p>
  }

  return(
    <div className="profile-page">
      <img
        src={profile.photo_url}
        alt="User-and-dog"
        className="profile-image"
      />

      <h2>{profile.username}</h2>
      <p>
        Name: {profile.fullname} 
        Age: {profile.age}
        Sex: {profile.sex}

        Dog Name: {profile.dog_name}
        Dog Breed: {profile.dog_breed}
        Dog Sex: {profile.dog_sex}
      </p>
    </div>
  )
}