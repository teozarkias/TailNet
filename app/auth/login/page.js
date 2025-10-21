"use client";

import "./login_page.css"
import { useState } from "react";

export default function LoginPage(){
  const[formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name] : e.target.value});
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const req = await fetch("/api/login",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await req.json();

      if(req.ok){
        alert("Login successful!");
        window.location.href = "/main";
      } else{
        // Pints the pre-default wrong of data
        setMessage(`${data.message}`);
      }

    } catch (error) {
      console.log("Error signing in");
      setMessage("Something went wrong...");
    }
  };


  return (
    <div className="login-page">
      <div className="login-box">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"

          >
            Login
          </button>

          <p>Dont have an account? &nbsp;
            <a href="/auth/register">Register</a>
          </p>
        </form>
      </div>

    </div>
  )
}