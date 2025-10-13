"use client";

import "./register_page.css"
import { useState } from "react";

export default function RegisterPage(){
  const [formData, setFormData ] = useState({
    fullname: "",
    username: "",
    password: "",
    repeatPassword: ""
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) =>{
    e.preventDefault();

    const {password, repeatPassword} = formData;

    if(password !== repeatPassword){
      console.log("Passwords dont match");
      return;
    }

    console.log("Register data: ", formData);
  };

  return(
    <div className="register-page">
      <div className="register-box">
        <h1>Register</h1>
        <form>
          <input
            type="text"
            name="fullname"
            placeholder="fullname"
            value={formData.name}
            onChange={handleChange}
          />
          
          <input
            type="text"
            name="username"
            placeholder="username"
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
            name="repeatPassword"
            placeholder="reapeat password"
            value={formData.repeatPassword}
            onChange={handleChange}
          />

          <button
            type="submit"
            onClick={handleSubmit}
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