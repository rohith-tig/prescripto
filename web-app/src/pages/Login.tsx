import React, { useState, useEffect } from "react";
import "../styles/Login.css";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { api } from "../config/app";
import axios from "axios";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const settingCookies = (jwt_token: string) => {
    Cookies.set("presToken", jwt_token, { expires: 1 });
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  useEffect(() => {
    const token = Cookies.get("presToken");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const loginFunc = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) {
      toast.warn("Please provide  email ", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    }
    if (!password) {
      toast.warn("Please provide password ", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    try {
      const userDetails = { email, password };
      const response = await api.post("/user/login", userDetails);
      toast.success(`welcome ${response.data.result.name}` || "welcome user");

      settingCookies(response.data.result.token);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Axios error message:",
          error.response?.data.message || error.message
        );

        toast.error(error.response?.data.message);
      } else {
        console.error("Unexpected error:", error);
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-cont">
        <div className="login-box">
          <h2>
            <span style={{ color: "#5f6fff" }}>User</span> Login
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
          <p className="signup-text">
            Don't have an account? <a href="/signup">Sign up here</a>
          </p>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;
