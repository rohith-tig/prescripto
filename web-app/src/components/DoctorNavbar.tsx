import Cookies from "js-cookie";
import "../styles/adddoctor.css";
import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const DoctorNavbar = () => {
  const smNavRef = useRef<HTMLDivElement>(null);
  const [clicked, setClicked] = useState<boolean>(false);
  const navigate = useNavigate();

  const menuClick = () => {
    setClicked((prev) => !prev);
  };

  const logoutFunc = () => {
    Cookies.remove("docToken");

    navigate("/doctor-login");
  };

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
      <nav className="admin-nav">
        <img
          className="admin-logo"
          alt="prescripto"
          src="https://res.cloudinary.com/duzolgclw/image/upload/v1729687963/admin_logo_ffyx3f.svg"
        />
        <button onClick={logoutFunc} className="admin-logout">
          logout
        </button>
        <button onClick={menuClick} className="menu-icon">
          <img
            width="70%"
            alt="menu-icon"
            src="https://res.cloudinary.com/duzolgclw/image/upload/v1727961071/menu_icon_a1ha9g.svg"
          />
        </button>
      </nav>
      {clicked && <div className="overlay" onClick={() => setClicked(false)} />}
      <div ref={smNavRef} className={`adminSmNav ${clicked ? "show" : ""}`}>
        <NavLink
          className={({ isActive }) =>
            isActive ? "smSideNav active" : "smSideNav"
          }
          to="/doctor-dashboard"
        >
          <p className="smPara">Dashboard</p>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "smSideNav active" : "smSideNav"
          }
          to="/doctor-appointment-list"
        >
          <p className="smPara">Appointments</p>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "smSideNav active" : "smSideNav"
          }
          to="/doctor-profile"
        >
          <p className="smPara">Profile</p>
        </NavLink>
      </div>
    </>
  );
};

export default DoctorNavbar;
