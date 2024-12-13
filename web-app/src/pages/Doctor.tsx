import Navbar from "../components/Navbar";
import { api } from "../config/app";
import { useState, useEffect } from "react";
import "../styles/doctor.css";
import { DoctorData, formatData } from "./Home";
import { Link, NavLink } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import Footer from "../components/Footer";
import { TailSpin } from "react-loader-spinner";
import useScrollToTop from "../components/ScrollToTop";

interface Speciality {
  id: string;
  value: string;
}
const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

export const specialityList: Speciality[] = [
  {
    id: "General physician",
    value: "General physician",
  },
  {
    id: "Gynecologist",
    value: "Gynecologist",
  },
  {
    id: "Dermatologist",
    value: "Dermatologist",
  },
  {
    id: "Pediatricians",
    value: "Pediatricians",
  },
  {
    id: "Neurologist",
    value: "Neurologist",
  },
  {
    id: "Gastroenterologist",
    value: "Gastroenterologist",
  },
];

const Doctor: React.FC = () => {
  useScrollToTop();
  const [data, setData] = useState<formatData[]>([]);
  const [apiStatus, setapiStatus] = useState<string>(
    apiStatusConstants.initial
  );
  const [transitionClass, setTransitionClass] = useState("");

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
      console.error("Error fetching doctors:", error);
    }
  };

  const renderLoadingView = () => (
    <div className="products-details-loader-container" data-testid="loader">
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

  const renderSuccessView = () => {
    return (
      <>
        <ul className="speciality-doc-div">
          {data.map((item: formatData) => (
            <li key={item.id} className="spec-doctors-li">
              <Link
                style={{ textDecoration: "none" }}
                to={`/appointment/${item.id}`}
              >
                <div className="doc-img-div">
                  <img className="doc-img" alt={item.name} src={item.image} />
                </div>
                {item.availability ? (
                  <p className="available">
                    <GoDotFill /> Available
                  </p>
                ) : (
                  <p className="not-available">
                    <GoDotFill /> Not-Available
                  </p>
                )}

                <p className="doc-name">{item.name}</p>
                <p className="doc-spec">{item.speciality}</p>
              </Link>
            </li>
          ))}
        </ul>
      </>
    );
  };
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
          className="omega"
          type="button"
        >
          Retry
        </button>
      </div>
    </>
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

  useEffect(() => {
    apiCall();
    setTransitionClass("bottom-right");
  }, []);
  return (
    <>
      <Navbar />
      <div className={`doctor-width ${transitionClass}`}>
        <div className="responsive-doctor-cont">
          <p className="browse">Browse through the doctors specialist.</p>
          <div className="doctor-flex-div">
            <div className="speciality-div">
              {specialityList.map((item) => (
                <NavLink
                  key={item.id}
                  to={`/doctors/${encodeURIComponent(item.id)}`}
                  className={({ isActive }) =>
                    isActive ? "speciality-btn active" : "speciality-btn"
                  }
                >
                  {item.value}
                </NavLink>
              ))}
            </div>
            {renderNxtWatchPage()}
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Doctor;
