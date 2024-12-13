import Cookies from "js-cookie";
import "../styles/adddoctor.css";
import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const smNavRef = useRef<HTMLDivElement>(null);
  const [clicked, setClicked] = useState<boolean>(false);
  const [chika, setChika] = useState<boolean>(false);
  const navigate = useNavigate();

  const menuClick = () => {
    setClicked((prev) => !prev);
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
        <button
          onClick={() => {
            setChika(true);
          }}
          className="admin-logout"
        >
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
          to="/admin-dashboard"
        >
          <p className="smPara">Dashboard</p>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "smSideNav active" : "smSideNav"
          }
          to="/admin-appointment-list"
        >
          <p className="smPara">Appointments</p>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "smSideNav active" : "smSideNav"
          }
          to="/add-doctor"
        >
          <p className="smPara">Add Doctor</p>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "smSideNav active" : "smSideNav"
          }
          to="/admin-doctor-list"
        >
          <p className="smPara">Doctors List</p>
        </NavLink>
      </div>
      {chika && (
        <>
          <div className="simbi">
            <div className="simbi1">
              <h3>Are you sure you want to logout?</h3>
              <div className="simbi2">
                <button
                  onClick={() => {
                    Cookies.remove("adToken");
                    setChika(false);

                    navigate("/admin-login");
                  }}
                  className="yes-button"
                >
                  Yes
                </button>
                <button
                  onClick={() => {
                    setChika((prev) => !prev);
                  }}
                  className="close-button"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AdminNavbar;
