import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "../styles/navbar.css";
import "../styles/adddoctor.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { SlCalender } from "react-icons/sl";

import { FiUser } from "react-icons/fi";
const Navbar: React.FC = () => {
  const [showCreate, setShowCreate] = useState<boolean>(true);
  const smNavRef = useRef<HTMLDivElement>(null);
  const [clicked, setClicked] = useState<boolean>(false);
  const [userExits, setUserExists] = useState<boolean>(false);
  const [zumba, setZumba] = useState<boolean>(false);
  const [chika, setChika] = useState<boolean>(false);
  const navigate = useNavigate();

  const menuClick = () => {
    setClicked((prev) => !prev);
  };
  const menuIcon = () => {
    setZumba((prev) => !prev);
  };

  const getCookies = () => {
    const token = Cookies.get("presToken");
    if (token !== undefined) {
      setShowCreate(false);
      setUserExists(true);
    } else {
      setShowCreate(true);
      setUserExists(false);
    }
  };

  const navLogOutFunc = () => {
    setChika((prev) => !prev);
    setZumba(false);
  };

  useEffect(() => {
    getCookies();
  }, [zumba, chika]);

  const handleClickOutside = (event: MouseEvent) => {
    if (smNavRef.current && !smNavRef.current.contains(event.target as Node)) {
      setClicked(false);
    }
  };

  useEffect(() => {
    if (clicked) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [clicked]);

  return (
    <>
      <div className="navbar-width">
        <div className="space" ref={smNavRef}>
          <NavLink to="/">
            <img
              className="logo"
              alt="prescripto"
              src="https://res.cloudinary.com/duzolgclw/image/upload/v1727787471/logo-prescripto_lfcmea.svg"
            />
          </NavLink>

          <div className="nav-center">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "navbar-link active" : "navbar-link"
              }
            >
              HOME
            </NavLink>
            <NavLink
              to="/doctors"
              className={({ isActive }) =>
                isActive ? "navbar-link active" : "navbar-link"
              }
            >
              DOCTORS
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? "navbar-link active" : "navbar-link"
              }
            >
              ABOUT
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? "navbar-link active" : "navbar-link"
              }
            >
              CONTACT
            </NavLink>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "navbar-link active" : "navbar-link"
              }
            >
              LOGIN
            </NavLink>
            <NavLink to="/admin-dashboard">
              <button className="admin-btn">Admin</button>
            </NavLink>
          </div>

          {showCreate ? (
            <Link to="/signup">
              <button className="create-btn">Create Account</button>
            </Link>
          ) : (
            <>
              <button
                onClick={menuIcon}
                className="user1"
                aria-label="User Profile"
              >
                <img
                  className="img1"
                  alt="user profile"
                  src="https://res.cloudinary.com/duzolgclw/image/upload/v1727961073/upload_area_ep8jrb.png"
                />
              </button>
            </>
          )}

          <button
            onClick={menuClick}
            className={userExits ? "sm-nav" : "sm-nav lefty"}
            aria-label="Menu"
          >
            <img
              width="70%"
              alt="menu icon"
              src="https://res.cloudinary.com/duzolgclw/image/upload/v1727961071/menu_icon_a1ha9g.svg"
            />
          </button>
        </div>
      </div>

      {clicked && <div className="lay" onClick={() => setClicked(false)} />}
      <div ref={smNavRef} className={`homeSmNav ${clicked ? "show" : ""}`}>
        <NavLink
          className={({ isActive }) =>
            isActive ? "smSideNav active" : "smSideNav"
          }
          to="/"
        >
          <p className="smPara">Home</p>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "smSideNav active" : "smSideNav"
          }
          to="/doctors"
        >
          <p className="smPara">DOCTORS</p>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "smSideNav active" : "smSideNav"
          }
          to="/about"
        >
          <p className="smPara">ABOUT</p>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "smSideNav active" : "smSideNav"
          }
          to="/contact"
        >
          <p className="smPara"> CONTACT</p>
        </NavLink>
      </div>
      {
        <>
          <div className={zumba ? "sangham show" : "sangham"}>
            <Link className="sang-Link" to="/user-profile">
              <FiUser size={20} style={{ marginRight: "10px" }} />
              Profile
            </Link>
            <Link className="sang-Link" to="/my-appointments">
              <SlCalender size={18} style={{ marginRight: "10px" }} />
              Appointments
            </Link>
            <button onClick={navLogOutFunc} className="sang-btn">
              <IoIosLogOut size={21} style={{ marginRight: "10px" }} /> Logout
            </button>
          </div>
        </>
      }
      {chika && (
        <>
          <div className="simbi">
            <div className="simbi1">
              <h3>Are you sure you want to logout?</h3>
              <div className="simbi2">
                <button
                  onClick={() => {
                    Cookies.remove("presToken");
                    setChika(false);
                    setZumba(false);
                    navigate("/");
                    console.log("showCreate:", zumba);
                  }}
                  className="yes-button"
                >
                  Logout
                </button>
                <button
                  onClick={() => {
                    setChika((prev) => !prev);
                    setZumba(false);
                  }}
                  className="close-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
