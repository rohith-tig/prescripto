import React, { useState, useEffect } from "react";
import "../styles/Login.css";

import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { api } from "../config/app";
import axios from "axios";
import Navbar from "../components/Navbar";

const DoctorLogin = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const [transitionClass, setTransitionClass] = useState("");
  const [isFading, setIsFading] = useState(false);

  const settingCookies = (jwt_token: string) => {
    Cookies.set("docToken", jwt_token, { expires: 1 });
    navigate("/doctor-profile");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setTransitionClass("right-to-left");
    }, 100);
    const token = Cookies.get("docToken");
    if (token) {
      navigate("/doctor-profile");
    }
    return () => clearTimeout(timer);
  }, [navigate]);

  const loginFunc = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      alert("Please provide both email and password!");
      return;
    }

    try {
      const doctorDetails = { email, password };
      const response = await api.post("/admin/doctor/login", doctorDetails);
      const data = response.data.result;
      console.log(data);
      settingCookies(data.token);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Axios error message:",
          error.response?.data.message || error.message
        );
        alert(error.response?.data.message);
      } else {
        console.error("Unexpected error:", error);
        alert("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className={`doc-login-cont ${transitionClass}`}>
        <div className="Doc-login-box">
          <h2>
            <span style={{ color: "#5f6fff" }}>Doctor </span>Login
          </h2>

          <form onSubmit={loginFunc}>
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
              Login
            </button>
          </form>
          <p
            style={{ marginLeft: "-8px", width: "170px" }}
            className="signup-text"
          >
            Admin Login? <a href="/admin-login">Click here</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default DoctorLogin;
