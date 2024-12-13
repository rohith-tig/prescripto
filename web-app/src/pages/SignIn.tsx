import React, { useState, useEffect } from "react";
import "../styles/Login.css";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { api } from "../config/app";
import axios from "axios";

const SignUp = () => {
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const settingCookies = (jwt_token: string) => {
    Cookies.set("presToken", jwt_token, { expires: 1 });
    navigate("/");
  };

  useEffect(() => {
    const token = Cookies.get("presToken");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  // Handle form submission (registration logic)
  const registerFunc = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!userName || !email || !password) {
      alert("Please provide all fields!");
      return;
    }

    try {
      const userDetails = { userName, email, password };
      const response = await api.post("/user/register", userDetails);
      const data = response.data.message;

      settingCookies(data.token); // Store JWT token in cookies
      localStorage.setItem("emailId", JSON.stringify(data.email)); // Store email in localStorage
    } catch (error) {
      // Check if the error is an AxiosError
      if (axios.isAxiosError(error)) {
        console.error(
          "Axios error message:",
          error.response?.data.message || error.message
        );
      } else {
        // Handle unexpected errors (non-Axios errors)
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-cont">
        <div className="login-box">
          <h2>Create Account</h2>
          <p className="zumba">Please sign up to book an appointment</p>
          <form onSubmit={registerFunc}>
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="login-button">
              Sign Up
            </button>
          </form>
          <p className="signup-text">
            Already have an account? <a href="/login">Login here</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;
