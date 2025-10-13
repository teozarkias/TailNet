"use client";

import "./login_page.css"
import { useState } from "react";

export default function LoginPage(){
  const[formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const handleSubmit = (e) =>{
    e.preventDefault();

    const {username, password} = formData;

    
  }

  return(
    <div className="login-page">
      <div className="login-box">
        <h1>Login</h1>
        <form className="form">
          <input
            type="text"
            name="username"
            placeholder="username"
            value={formData.name}
          />

          <input
            type="password"
            name="password"
            placeholder="password"
            value={formData.name}
          />

          <button
            type="submit"
            onClick={handleSubmit}
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