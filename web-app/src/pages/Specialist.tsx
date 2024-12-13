import { NavLink, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { api } from "../config/app";
import { DoctorData, formatData } from "./Home";
import { specialityList } from "./Doctor";
import { GoDotFill } from "react-icons/go";
import Footer from "../components/Footer";
import useScrollToTop from "../components/ScrollToTop";
import { ThreeDots } from "react-loader-spinner";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const Specialist: React.FC = () => {
  useScrollToTop();
  const { speciality } = useParams<{ speciality: string }>();
  const [data, setData] = useState<formatData[]>([]);
  const [apiStatus, setapiStatus] = useState<string>(
    apiStatusConstants.initial
  );

  const apiCall = async () => {
    try {
      setapiStatus(apiStatusConstants.inProgress);
      const response = await api.get(`/user/doctors/${speciality}`);
      const fetchedData = response.data.data;

      if (!fetchedData || fetchedData.length === 0) {
        const msg = `No doctors found for ${speciality}`;

        setapiStatus(apiStatusConstants.failure);
        toast.error(msg);
        return;
      }

      const formattedData = fetchedData.map((item: DoctorData) => ({
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
      }));

      setData(formattedData);
      setapiStatus(apiStatusConstants.success);
    } catch (error) {
      setapiStatus(apiStatusConstants.failure);
      const msg =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";

      toast.error(msg); // Show toast notification on error
    }
  };

  useEffect(() => {
    apiCall();
  }, [speciality]);

  const renderLoadingView = () => (
    <div className="products-details-loader-container" data-testid="loader">
      <ThreeDots color="#0b69ff" height="50" width="50" />
    </div>
  );

  const renderSuccessView = () => {
    return (
      <>
        {data.length > 0 ? (
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
                  <p className="available">
                    <GoDotFill /> Available
                  </p>
                  <p className="doc-name">{item.name}</p>
                  <p className="doc-spec">{item.speciality}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No doctors found in this specialty.</p>
        )}
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
          disabled={apiStatus === apiStatusConstants.inProgress}
        >
          {apiStatus === apiStatusConstants.inProgress ? (
            <ThreeDots color="#fff" height="20" width="20" />
          ) : (
            "Retry"
          )}
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

  return (
    <>
      <Navbar />
      <div className="doctor-width">
        <div className="responsive-doctor-cont">
          <p className="browse">Browse through the doctors specialist.</p>
          <div className="doctor-flex-div">
            <div className="speciality-div">
              {specialityList.map((item) => (
                <NavLink
                  key={item.id}
                  to={`/doctors/${encodeURIComponent(item.id)}`}
                  className="speciality-btn"
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
      <ToastContainer />
    </>
  );
};

export default Specialist;
