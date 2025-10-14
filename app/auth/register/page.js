"use client";

import "./register_page.css"
import { useState } from "react";



export default function RegisterPage(){
  const [formData, setFormData ] = useState({
    username: "",
    fullname: "",
    age: "",
    dog_name: "",
    dog_breed: "",
    password: "",
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


  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);
  const [step, setStep] = useState(1);

  return(
    <div className="register-page">
      <div className="register-box">
        <h1>Welcome Dog Walker!</h1>
        <form>
          {step === 1 && (
          <>
            <input
              type="text"
              name="username"
              placeholder="username"
              value={formData.username}
              onChange={handleChange}
            />

            <input
              type="text"
              name="fullname"
              placeholder="fullname"
              value={formData.fullname}
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
              placeholder="repeat password"
              value={formData.repeatPassword}
              onChange={handleChange}
            />

            <button
              type="submit"
              onClick={handleSubmit}
            >
              Dog Walker
            </button>

            <div className="BackForthButtons-box">
              <button
                type="button"
                onClick={handleBack}
                className="text-gray-500 p-2"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="bg-blue-500 text-white p-2 rounded"
              >
                  Next →
              </button>
            </div>
          </>
          )}

        (step === 2 &&{
          <>
            <h1>Tell us about your dog 🐾</h1>

            <input
              type="text"
              name="dogName"
              placeholder="Dog's Name"
              value={formData.dog_name}
              onChange={handleChange}
            />

            <select
              value={formData.dog_breed}
              onChange={handleChange}
            >
              <option value="">Select Breed</option>
              <option></option>
              

            </select>

            <div className="BackForth-box">
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-gray-500 p-2"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Next →
                </button>
              </div>
          </>
        })


        (step === 3 && {
          <>
            <h1>Strike a Pawse</h1>


          </>
        })
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