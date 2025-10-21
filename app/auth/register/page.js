"use client";

import "./register_page.css";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    repeatPassword: "",
    fullname: "",
    age: "",
    sex: "",
    dog_name: "",
    dog_breed: "",
    dog_sex: "",
    photo: null,
    photoPreview:"",
  });


  const [step, setStep] = useState(1);
  
  // Handle un-verified moves in every step
  const validateStep = () => {
    if(step === 1){
      if(formData.password !== formData.repeatPassword){
        alert("Passwords dont match");
        return false;
      }

      if(!formData.username || !formData.password || !formData.repeatPassword){
        alert("Complete all the fields");
        return false;
      }
    }

    if(step === 2){
      if(!formData.fullname || !formData.age || !formData.sex){
        alert("Complete all the fields");
        return false;
      }
    }

    if(step === 3){
      if(!formData.dog_name || !formData.dog_breed || !formData.dog_sex){
        alert("Complete all the fields")
        return false;
      }
    }

    return true; //Let user not post a photo now
  }



  // Handle functions
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { password, repeatPassword, photo, ...rest } = formData;
    if (password !== repeatPassword) {
      alert("Passwords don’t match!");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...rest,
          password,
          photo_url: formData.photoPreview || null
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration successful!");
        window.location.href = "/auth/login";
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong...");
    }
  };


  const handleNext = (e) => {
    e.preventDefault();
    if(validateStep()){
      setStep((s) => s + 1);
    }
  };

  const handleBack = (e) => {
    e.preventDefault();
    setStep((s) => s - 1);
  };



  return (
    <div className="register-page">
      <div className="register-box">
        <p className="step-indicator">Step {step} of 4</p>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && (
                <>
                  <h2>Welcome Dog Walker!</h2>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <input
                    type="password"
                    name="repeatPassword"
                    placeholder="Repeat Password"
                    value={formData.repeatPassword}
                    onChange={handleChange}
                  />
                  <div className="buttons-box">
                    <button onClick={handleNext}>→</button>
                  </div>

                  <p>
                    Already have an account?{" "}
                    <a href="/auth/login">&nbsp;Login</a>
                  </p>
                </>
              )}

              {step === 2 && (
                <>
                  <h2>Personal Info</h2>
                  <input
                    type="text"
                    name="fullname"
                    placeholder="Full Name"
                    value={formData.fullname}
                    onChange={handleChange}
                  />
                  <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={formData.age}
                    onChange={handleChange}
                  />
                  <select
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-Binary</option>
                  </select>

                  <div className="buttons-box">
                    <button onClick={handleBack}>←</button>
                    <button onClick={handleNext}>→</button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h2>Tell Us About Your Friend 🐾</h2>
                  <input
                    type="text"
                    name="dog_name"
                    placeholder="Dog's Name"
                    value={formData.dog_name}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="dog_breed"
                    placeholder="Dog's Breed"
                    value={formData.dog_breed}
                    onChange={handleChange}
                  />
                  <select
                    name="dog_sex"
                    value={formData.dog_sex}
                    onChange={handleChange}
                  >
                    <option value="">Select Dog’s Sex</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>

                  <div className="buttons-box">
                    <button onClick={handleBack}>←</button>
                    <button onClick={handleNext}>→</button>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <h2>Strike a Pawse 📸</h2>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        setFormData((prev) => ({
                          ...prev,
                          photo: file,
                          photoPreview: reader.result,
                        }));
                      };
                      reader.readAsDataURL(file);
                    }}
                  />

                  {formData.photoPreview && (
                    <div className="photo-preview">
                      <img src={formData.photoPreview} alt="Preview" />
                    </div>
                  )}

                  <div className="buttons-box">
                    <button onClick={handleBack}>←</button>
                    <button onClick={handleSubmit}>Finish</button>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
