import React, { useState, useEffect, useMemo } from "react";
import { api } from "../config/app";
import AdminNavbar from "../components/AdminNavbar";
import "../styles/adddoctor.css";
import AdminSidebar from "../components/AdminSidebar";
import { formatData, DoctorData } from "./Home";
import { Link } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const AdminDoctorsListPage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [apiStatus, setapiStatus] = useState<string>(
    apiStatusConstants.initial
  );
  const apiCall = async (): Promise<void> => {
    try {
      setapiStatus(apiStatusConstants.inProgress);

      const response = await api.get("/user/doctors");
      const fetchedData = response.data.data;

      if (!fetchedData || fetchedData.length === 0) {
        setData([]);
        setapiStatus(apiStatusConstants.success);
        toast.info("No doctors found.");
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
        available: item.availability,
      }));

      setData(formattedData);
      setapiStatus(apiStatusConstants.success);
    } catch (error: any) {
      setapiStatus(apiStatusConstants.failure);

      if (error.response) {
        const { status } = error.response;
        if (status === 404) {
          setData([]);
          toast.info("No doctors found.");
        } else if (status === 500) {
          toast.error("Internal server error. Please try again later.");
        } else {
          toast.error("Error fetching doctors. Please try again.");
        }
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  useEffect(() => {
    apiCall();
  }, []);

  const handleCheckboxChange = async (
    id: string,
    name: string,
    currentAvailability: boolean
  ) => {
    const newAvailability = !currentAvailability;

    try {
      await api.put(`/admin/doctors/${id}/availability`, {
        available: newAvailability,
      });

      setData((prevData) =>
        prevData.map((doctor) =>
          doctor.id === id ? { ...doctor, available: newAvailability } : doctor
        )
      );
      toast.success(` ${name} availability updated to: ${newAvailability}`);
    } catch (error) {
      console.error("Error updating availability:", error);
      toast.error("Failed to update availability. Please try again.");
    }
  };

  const sortedData = useMemo(() => [...data], [data]);

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
  const renderLoadingView = () => (
    <div
      style={{
        marginTop: "auto",
        marginBottom: "auto",
        marginLeft: "auto",
        marginRight: "auto",
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
  const renderSuccessView = () => {
    return (
      <>
        {sortedData.map((item) => (
          <li key={item.id} className="admin-d-li">
            <Link
              style={{ textDecoration: "none" }}
              to={`/admin-doctor-profile/${item.id}`}
            >
              <div className="d-i-d">
                <img className="doc-img" alt={item.name} src={item.image} />
              </div>
            </Link>

            <p className="card-na">{item.name}</p>
            <p className="card-sp">{item.speciality}</p>
            <p
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "-10px",
              }}
            >
              <input
                type="checkbox"
                checked={item.available}
                size={20}
                onChange={() =>
                  handleCheckboxChange(item.id, item.name, item.available)
                }
                style={{ marginLeft: "10px" }}
              />
              <label
                style={{
                  color: "#0fbf00",
                  fontSize: "20px",
                  marginLeft: "5px",
                }}
              >
                Available
              </label>
            </p>
          </li>
        ))}
      </>
    );
  };
  const renderPrescriptoPage = () => {
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
      <AdminNavbar />
      <div className="adminPage">
        <AdminSidebar />
        <div className="add-doctor-cont">
          <h1 className="gurbha">All Doctors</h1>
          <div className="dfmc">
            <ul className="admin-d-div">{renderPrescriptoPage()}</ul>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AdminDoctorsListPage;
