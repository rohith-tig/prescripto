import React, { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import DoctorSidebar from "../components/DoctorSidebar";
import "../styles/adddoctor.css";
import { api } from "../config/app";
import Cookies from "js-cookie";
import { docData } from "./Appointment";
import { TailSpin } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DoctorNavbar from "../components/DoctorNavbar";

interface DASHBOARDDBDATA {
  id: string;
  appointment_day: string;
  appointment_hour: number;
  patient_img_url: string;
  patient_name: string;
  status: string;
  appointment_date: Date;
  fees: number;
}

interface DASHBOARDDATA {
  id: string;
  appointmentDay: string;
  appointmentHour: number;
  patientImage: string;
  patientName: string;
  status: string;
  appointmentDate: Date;
  fees: number;
}
interface limData {
  fees: number;
  earnings: number;
}
const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const DoctorDashBoard: React.FC = () => {
  const navigate = useNavigate();
  const token = Cookies.get("docToken");
  if (!token) {
    navigate("/doctor-login");
  }
  const [data, setData] = useState<DASHBOARDDATA[]>([]);
  const [appointmentCount, setAppointmentCount] = useState<number>(0);

  const [doctorData, setDoctorData] = useState<limData | null>(null);
  const [apiStatus, setapiStatus] = useState<string>(
    apiStatusConstants.initial
  );
  const [appointLength, setAppointLen] = useState<number>(0);
  const [patientCount, setPatientCount] = useState<number>(0);
  const [chika, setChika] = useState<boolean>(false);
  const [appointId, setAppointId] = useState<string>("");
  const [patientName, setPatientName] = useState<string>("");
  const [statusText, setStatusText] = useState<string>("");
  const [labelText, setlabelText] = useState<string>("");
  let toastShown = false;
  const apiCall = async () => {
    try {
      setapiStatus(apiStatusConstants.inProgress);
      const token = Cookies.get("docToken");

      if (!token) {
        toast.error("No token found. Please login again.");
        setapiStatus(apiStatusConstants.failure);
        return;
      }

      const response = await api.get("/admin/doctor-dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response?.data) {
        toast.error("No data received from the server.");
        setapiStatus(apiStatusConstants.failure);
        return;
      }

      console.log(response);

      const appointments = response.data?.data.appointments;
      const doctorProfile = response.data?.data.doctor;

      if (!appointments || appointments.length === 0) {
        if (!toastShown) {
          toast.info("No new appointments.");
          toastShown = true;
        }
      }

      const formattedData = appointments.map((item: DASHBOARDDBDATA) => ({
        id: item.id,
        appointmentDay: item.appointment_day,
        appointmentHour: item.appointment_hour,
        patientImage: item.patient_img_url,
        patientName: item.patient_name,
        status: item.status,
        appointmentDate: item.appointment_date,
        fees: item.fees,
      }));

      setAppointLen(formattedData.length);

      const formattedDocData: limData = {
        earnings: doctorProfile.earnings,
        fees: doctorProfile.fees,
      };

      setData(formattedData);
      setDoctorData(formattedDocData);

      const patientCount = appointments.filter(
        (item: DASHBOARDDBDATA) => item.status === "Completed"
      );
      console.log(patientCount);
      setPatientCount(patientCount.length);

      setapiStatus(apiStatusConstants.success);
    } catch (error: any) {
      setapiStatus(apiStatusConstants.failure);

      if (error.response) {
        console.error("Error response from server:", error.response.data);
        toast.error(error.response.data.message || "Error from server.");
      } else if (error.request) {
        console.error("Network error:", error.request);
        toast.error("Network error. Please check your connection.");
      } else if (error.response?.status === 401) {
        navigate("/doctor-login");
      } else {
        console.error("Unexpected error:", error.message);
        toast.error("An unexpected error occurred.");
      }
    }
  };

  useEffect(() => {
    apiCall();
  }, [token]);

  const formatDate = (dateString: Date): string => {
    const date = new Date(dateString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const confirmAndCancelButton = async () => {
    try {
      const response = await api.put(`/admin/patient/${appointId}/status`, {
        patientName,
        statusText,
      });
      console.log(response);

      if ((response.status = 200)) {
        toast.success(response.data.message);
      }

      await apiCall();
    } catch (error: any) {
      if (error.response) {
        toast.error(`Server error: ${error.response.data.message}`);
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else if (error.code === "ECONNABORTED") {
        toast.error("Request timeout. Please try again later.");
      } else {
        toast.error(`Unexpected error: ${error.message}`);
      }
    }
  };

  const renderAppointments = () => {
    const waitingAppointments = data.filter(
      (item) => item.status === "Waiting"
    );
    return (
      <>
        <div className="latestAppointCont">
          <div
            style={{
              marginLeft: "10px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              height: "30px",
              paddingTop: "10px",
            }}
          >
            <img
              src="https://res.cloudinary.com/duzolgclw/image/upload/v1729690401/list_icon_j3c53n.svg"
              alt="list"
            />
            <p
              style={{
                marginLeft: "10px",
                fontWeight: "500",
                fontSize: "18px",
              }}
            >
              Latest Bookings
            </p>
          </div>
          <hr />
          {waitingAppointments.map((item: DASHBOARDDATA) => {
            const formattedDate = formatDate(item.appointmentDate);

            return (
              <div className="newPatientDiv" key={item.id}>
                <img
                  className="userDp"
                  style={{ paddingLeft: "10px" }}
                  src={item.patientImage}
                  alt={item.patientName}
                />
                <div style={{ paddingLeft: "10px" }}>
                  <p style={{ color: "black", fontWeight: "500" }}>
                    {item.patientName}
                  </p>
                  <p style={{ marginLeft: "-20px" }} className="paraStyle">
                    Booked on {formattedDate},{item.appointmentHour}:00
                  </p>
                </div>
                <button
                  onClick={() => {
                    setAppointId(item.id);
                    setPatientName(item.patientName);
                    setChika(true);
                    setStatusText("Cancelled");
                    setlabelText("Cancel");
                  }}
                  className="cancelBtn"
                >
                  <img
                    className="cancelImg"
                    src="https://res.cloudinary.com/duzolgclw/image/upload/v1729690401/cancel_icon_qr9lyw.svg"
                    alt="cancel"
                  />
                </button>
                <button
                  onClick={() => {
                    setAppointId(item.id);
                    setPatientName(item.patientName);
                    setChika(true);
                    setlabelText("Confirm");
                    setStatusText("Confirmed");
                  }}
                  className="confirmBtn"
                >
                  <img
                    className="cancelImg"
                    src="https://res.cloudinary.com/duzolgclw/image/upload/v1729690403/tick_icon_mnlkyi.svg"
                    alt="tick"
                  />
                </button>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  const renderLoadingView = () => (
    <div
      style={{
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "auto",
        marginBottom: "auto",
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
  const renderSuccessView = () => {
    return (
      <>
        <div className="doc-dash">
          <div className="dash">
            <img
              alt="earnings"
              src="https://res.cloudinary.com/duzolgclw/image/upload/v1729690402/earning_icon_zf7zna.svg"
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "10px",
              }}
            >
              <p
                style={{
                  marginBottom: "-10px",
                  color: "#323232",
                  fontWeight: "500",
                }}
              >
                $ {doctorData?.earnings}
              </p>
              <p style={{ color: "#515151", fontWeight: "500" }}>earnings</p>
            </div>
          </div>
          <div className="dash">
            <img
              alt="appointments"
              src="https://res.cloudinary.com/duzolgclw/image/upload/v1729690400/appointments_icon_ou3shh.svg"
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "10px",
              }}
            >
              <p
                style={{
                  marginBottom: "-10px",
                  color: "#323232",
                  fontWeight: "500",
                }}
              >
                {appointLength}
              </p>
              <p style={{ color: "#515151", fontWeight: "500" }}>
                appointments
              </p>
            </div>
          </div>
          <div className="dash">
            <img
              alt="patients"
              src="https://res.cloudinary.com/duzolgclw/image/upload/v1729690403/patients_icon_fr473i.svg"
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "10px",
              }}
            >
              <p
                style={{
                  marginBottom: "-10px",
                  color: "#323232",
                  fontWeight: "500",
                }}
              >
                {patientCount}
              </p>
              <p style={{ color: "#515151", fontWeight: "500" }}>patients</p>
            </div>
          </div>
        </div>
        {renderAppointments()}
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
      <DoctorNavbar />
      <div className="adminPage">
        <DoctorSidebar />
        <div className="add-doctor-cont">
          <div className="dashboardContainer">{renderPrescriptoPage()}</div>
        </div>
      </div>
      {chika && (
        <>
          <div className="simbi">
            <div className="simbi1">
              <h3>
                {labelText} {patientName}'s Appointment?
              </h3>
              <div className="simbi2">
                <button
                  onClick={() => {
                    confirmAndCancelButton();
                    setChika(false);
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
      <ToastContainer />
    </>
  );
};

export default DoctorDashBoard;
