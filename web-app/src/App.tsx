import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home, { formatData } from "./pages/Home";
import Doctor from "./pages/Doctor";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SignIn from "./pages/SignIn";
import Dummy from "./pages/Dummy";
import Specialist from "./pages/Specialist";
import Appointment from "./pages/Appointment";
import AddDoctor from "./pages/AddDoctor";

import AdminDoctorsListPage from "./pages/AdminDoctorsList";
import Profile from "./pages/UserProfile";
import MyAppointment from "./pages/MyAppointmentsPage";
import AdminAppointmentList from "./pages/AdminDoctorsPage";
import DoctorAppointmentList from "./pages/DoctorsAppointmentList";
import prescriptoContext from "./context/PrescriptoContext";
import DoctorsProfile from "./pages/DoctorsProfilePage";
import DoctorLogin from "./pages/DoctorLoginPage";
import DoctorDashBoard from "./pages/DoctorDashboard";
import AdminDashBoard from "./pages/AdminDasboard";
import AdminDocProfile from "./pages/AdminDocProfile";
import AdminLogin from "./pages/AdminLogin";
import {
  ProtectedRoute,
  DocProtectedRoute,
  AdminProtectedRoute,
} from "./components/UserProtectedRoute";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctor />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignIn />} />
        <Route path="/dummy" element={<Dummy />} />
        <Route path="/doctors/:speciality" element={<Specialist />} />
        <Route path="/appointment/:id" element={<Appointment />} />

        <Route path="/admin-login" element={<AdminLogin />} />

        <Route path="/doctor-login" element={<DoctorLogin />} />

        <Route element={<DocProtectedRoute />}>
          <Route
            path="/doctor-appointment-list"
            element={<DoctorAppointmentList />}
          />
          <Route path="/doctor-profile" element={<DoctorsProfile />} />
          <Route path="/doctor-dashboard" element={<DoctorDashBoard />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/my-appointments" element={<MyAppointment />} />
          <Route path="/user-profile" element={<Profile />} />
        </Route>
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin-dashboard" element={<AdminDashBoard />} />
          <Route
            path="/admin-doctor-profile/:id"
            element={<AdminDocProfile />}
          />
          <Route
            path="/admin-appointment-list"
            element={<AdminAppointmentList />}
          />
          <Route path="/add-doctor" element={<AddDoctor />} />
          <Route path="/admin-doctor-list" element={<AdminDoctorsListPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
