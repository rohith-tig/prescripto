import { NavLink } from "react-router-dom";
import "../styles/adddoctor.css";
const DoctorSidebar = () => (
  <>
    <div className="sidebar">
      <NavLink
        className={({ isActive }) => (isActive ? "sidenav active" : "sidenav")}
        to="/doctor-dashboard"
      >
        <img
          className="dashboard"
          alt="dashboard"
          src="https://res.cloudinary.com/duzolgclw/image/upload/v1729690401/home_icon_bxkm9c.svg"
        />
        <p className="dashPara">Dashboard</p>
      </NavLink>
      <NavLink
        className={({ isActive }) => (isActive ? "sidenav active" : "sidenav")}
        to="/doctor-appointment-list"
      >
        <img
          className="dashboard"
          alt="dashboard"
          src="https://res.cloudinary.com/duzolgclw/image/upload/v1729690400/appointment_icon_kl2g6w.svg"
        />
        <p className="dashPara">Appointments</p>
      </NavLink>

      <NavLink
        className={({ isActive }) => (isActive ? "sidenav active" : "sidenav")}
        to="/doctor-profile"
      >
        <img
          className="dashboard"
          alt="dashboard"
          src="https://res.cloudinary.com/duzolgclw/image/upload/v1729690403/people_icon_xg1u9g.svg"
        />
        <p className="dashPara">Profile</p>
      </NavLink>
    </div>
  </>
);

export default DoctorSidebar;
