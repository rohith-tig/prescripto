import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/home.css";
import { FaArrowRight } from "react-icons/fa";
import Doctorsinfo from "../components/DoctorsInfo";
import { Link, NavLink } from "react-router-dom";
import Footer from "../components/Footer";
import { useRef } from "react";
import { api } from "../config/app";

import { TailSpin } from "react-loader-spinner";

export interface Doctorsts {
  _id: string;
  name: string;
  image: string;
  speciality: string;
  degree: string;
  experience: string;
  about: string;
  fees: number;
  address: {
    line1: string;
    line2: string;
  };
}
export interface DoctorData {
  id: string;
  name: string;
  email: string;
  image: string;
  doc_image_url: string;
  speciality: string;
  degree: string;
  experience: string;
  about: string;
  fees: number;
  adr_line1: string;
  adr_line2: string;
  availability: boolean;
}

export interface formatData {
  id: string;
  name: string;
  email: string;

  image: string;
  speciality: string;
  degree: string;
  experience: string;
  about: string;
  fees: number;
  adrLine1: string;
  adrLine2: string;
  availability: boolean;
}

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const Home: React.FC = () => {
  const targetDivRef = useRef<HTMLDivElement | null>(null);
  const [data, setData] = useState<formatData[]>([]);

  const [apiStatus, setapiStatus] = useState<string>(
    apiStatusConstants.initial
  );
  const [transitionClass, setTransitionClass] = useState("");

  const scrollToDiv = () => {
    targetDivRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const apiCall = async () => {
    try {
      setapiStatus(apiStatusConstants.inProgress);
      const response = await api.get("/user/doctors");

      const data = await response.data.data;

      const formattedData = data.map((item: DoctorData) => ({
        id: item.id,
        name: item.name,
        email: item.email,

        image: item.doc_image_url,
        speciality: item.speciality,
        degree: item.degree,
        experience: item.experience,
        about: item.about,
        fees: item.fees,
        adrLine1: item.adr_line1,
        adrLine2: item.adr_line2,
        availability: item.availability,
      }));
      setData(formattedData);
      setapiStatus(apiStatusConstants.success);
    } catch (error) {
      setapiStatus(apiStatusConstants.failure);
      console.error(error);
    }
  };

  useEffect(() => {
    apiCall();

    setTransitionClass("bottom-right");
  }, []);

  const renderLoadingView = () => (
    <div
      style={{
        marginLeft: "45%",
      }}
      data-testid="loader"
    >
      <TailSpin
        visible={true}
        height="80"
        width="80"
        color="blue"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
  const renderFailureView = () => (
    <>
      <div className="jingari random-search">
        <img
          className="no-search-img"
          alt="failure"
          src="https://res.cloudinary.com/duzolgclw/image/upload/v1731299628/88f1307d1a6b8fd41580f7f49d68ccea_vrygdg.jpg"
        />

        <button
          onClick={() => {
            apiCall();
          }}
          style={{ marginTop: "5px" }}
          className="omega"
          type="button"
        >
          Retry
        </button>
      </div>
    </>
  );

  const renderSuccessView = () => (
    <ul className="doctors-ul">
      {data.map((doctor: formatData) => (
        <Doctorsinfo key={doctor.id} doctorInfo={doctor} />
      ))}
    </ul>
  );

  const renderNxtWatchPage = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderSuccessView();
      case apiStatusConstants.failure:
        return renderFailureView();
      case apiStatusConstants.inProgress:
        return renderLoadingView();
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <div className={`home-width ${transitionClass}`}>
        <div className="responsive-home-cont">
          <div id="mamba" className="appointment-container">
            <div className="appointment-para">
              <h1 className="app-heading">
                Book Appointment With Trusted Doctors
              </h1>
              <div className="profile-div">
                <img
                  className="group-pic"
                  alt="group"
                  src="https://res.cloudinary.com/duzolgclw/image/upload/v1727945542/group_profiles_shj9jk.png"
                />
                <p className="profile-para">
                  Simply browse through our extensive list of trusted doctors,
                  schedule your appointment hassle-free.
                </p>
              </div>

              <button onClick={scrollToDiv} className="appoint-btn">
                Book Appointment <FaArrowRight className="arrow" size={14} />
              </button>
            </div>
            <div className="doctor-cont">
              <img
                alt="doctor"
                src="https://res.cloudinary.com/duzolgclw/image/upload/v1727951240/header_img_dayms0.png"
                className="doctor-css"
              />
            </div>
          </div>
          <h1 className="special-h">Find by Speciality</h1>
          <p className="special-p">
            Simply browse through our extensive list of trusted doctors,
            schedule your appointment hassle-free.
          </p>
          <div className="scroll">
            <div className="medical-fields">
              <NavLink
                to={`/doctors/${encodeURIComponent("General physician")}`}
                className="medical-col"
              >
                <img
                  className="profession-logo"
                  alt="physician"
                  src="https://res.cloudinary.com/duzolgclw/image/upload/v1727961009/General_physician_cwreoh.svg"
                />
                <p className="profession-para">General Physician</p>
              </NavLink>
              <NavLink
                to={`/doctors/${encodeURIComponent("Gynecologist")}`}
                className="medical-col"
              >
                <img
                  className="profession-logo"
                  alt="Gynecologist"
                  src="https://res.cloudinary.com/duzolgclw/image/upload/v1727961070/Gynecologist_gtn1l6.svg"
                />
                <p className="profession-para">Gynecologist</p>
              </NavLink>
              <NavLink
                to={`/doctors/${encodeURIComponent("Dermatologist")}`}
                className="medical-col"
              >
                <img
                  className="profession-logo"
                  alt="Dermatologist"
                  src="https://res.cloudinary.com/duzolgclw/image/upload/v1727961062/Dermatologist_doa06i.svg"
                />
                <p className="profession-para">Dermatologist</p>
              </NavLink>
              <NavLink
                to={`/doctors/${encodeURIComponent("Pediatricians")}`}
                className="medical-col"
              >
                <img
                  className="profession-logo"
                  alt="Pediatricians"
                  src="https://res.cloudinary.com/duzolgclw/image/upload/v1727961072/Pediatricians_qmrnlm.svg"
                />
                <p className="profession-para">Pediatricians</p>
              </NavLink>
              <NavLink
                to={`/doctors/${encodeURIComponent("Neurologist")}`}
                className="medical-col"
              >
                <img
                  className="profession-logo"
                  alt="Neurologist"
                  src="https://res.cloudinary.com/duzolgclw/image/upload/v1727961072/Neurologist_pedybc.svg"
                />
                <p className="profession-para">Neurologist</p>
              </NavLink>
              <NavLink
                to={`/doctors/${encodeURIComponent("Gastroenterologist")}`}
                className="medical-col"
              >
                <img
                  className="profession-logo"
                  alt="Gastroenterologist"
                  src="https://res.cloudinary.com/duzolgclw/image/upload/v1727961069/Gastroenterologist_lgeigk.svg"
                />
                <p className="profession-para">Gastroenterologist</p>
              </NavLink>
            </div>
          </div>
          <h1 ref={targetDivRef} className="special-h">
            Top Doctors to Book
          </h1>
          <p className="special-p">
            Simply browse through our extensive list of trusted doctors.
          </p>
          {renderNxtWatchPage()}
          <Link to="/doctors">
            <div style={{ textAlign: "center" }}>
              <button className="more">more</button>
            </div>
          </Link>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
