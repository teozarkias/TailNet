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
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { password, repeatPassword } = formData;
    if (password !== repeatPassword) {
      alert("Passwords don’t match!");
      return;
    }

    console.log("Register data:", formData);
    alert("Registration complete! 🎉");
    // here you’ll POST formData to /api/register
  };

  const [step, setStep] = useState(1);
  const handleNext = (e) => {
    e.preventDefault();
    setStep((s) => s + 1);
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

        <form>
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        photo: e.target.files[0],
                      })
                    }
                  />

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
