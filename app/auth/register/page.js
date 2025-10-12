"use client";

import "./register_page.css"
import { useState } from "react";

export default function RegisterPage(){
  const [formData, setFormData ] = useState({
    username: "",
    name: "",
    surname: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) =>{
    e.preventDefault();
    console.log("Register data: ", formData);
  };

  return(
    <div className="register-page">
      <div className="register-box">
        <h1>Register</h1>
        <form>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
          
          <input
            type="text"
            name="surname"
            placeholder="Surname"
            value={formData.surname}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="password"
            value={formData.password}
            onChange={handleChange}
          />

          <input
            type="password"
            name="reapeatPassword"
            placeholder="reapeat password"
            value={formData.password}
            onChange={handleChange}
          />

          <button
            type="submit"
          >
            Dog Walker
          </button>
        </form>

        <p>
          Already have and account?
          <a href="/auth/login">
              &nbsp;Login
          </a>
        </p>
        
      </div>
    </div>
  )
}