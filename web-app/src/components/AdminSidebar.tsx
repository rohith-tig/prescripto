import { NavLink } from "react-router-dom";
import "../styles/adddoctor.css";
const AdminSidebar = () => (
  <>
    <div className="sidebar">
      <NavLink
        className={({ isActive }) => (isActive ? "sidenav active" : "sidenav")}
        to="/admin-dashboard"
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
        to="/admin-appointment-list"
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
        to="/add-doctor"
      >
        <img
          className="dashboard"
          alt="dashboard"
          src="https://res.cloudinary.com/duzolgclw/image/upload/v1729690400/add_icon_clx0r2.svg"
        />
        <p className="dashPara">Add Doctor</p>
      </NavLink>
      <NavLink
        className={({ isActive }) => (isActive ? "sidenav active" : "sidenav")}
        to="/admin-doctor-list"
      >
        <img
          className="dashboard"
          alt="dashboard"
          src="https://res.cloudinary.com/duzolgclw/image/upload/v1729690403/people_icon_xg1u9g.svg"
        />
        <p className="dashPara">Doctors List</p>
      </NavLink>
    </div>
  </>
);

export default AdminSidebar;
