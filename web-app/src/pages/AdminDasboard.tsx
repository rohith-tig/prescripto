import React, { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";

import "../styles/adddoctor.css";
import { api } from "../config/app";
import AdminSidebar from "../components/AdminSidebar";
import Cookies from "js-cookie";
import { TailSpin } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";

interface DASHBOARDDBDATA {
  id: string;
  appointment_day: string;
  appointment_hour: number;
  patient_img_url: string;
  patient_name: string;
  status: string;
  appointment_date: Date;
  doc_img_url: string;
  doctor_name: string;
}

interface DASHBOARDDATA {
  id: string;
  appointmentDay: string;
  appointmentHour: number;
  patientImage: string;
  patientName: string;
  status: string;
  appointmentDate: Date;
  docImg: string;
  doctorName: string;
}
const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const AdminDashBoard = () => {
  const doc = localStorage.getItem("docId");
  const docId = doc ? JSON.parse(doc) : null;
  const [data, setData] = useState<DASHBOARDDATA[]>([]);
  const [appointLength, setAppointLen] = useState<number>(0);
  const [patientCount, setPatientCount] = useState<number>(0);
  const [apiStatus, setapiStatus] = useState<string>(
    apiStatusConstants.initial
  );
  const [chika, setChika] = useState<boolean>(false);
  const [appointId, setAppointId] = useState<string>("");
  const [patientName, setPatientName] = useState<string>("");
  const [statusText, setStatusText] = useState<string>("");
  const [labelText, setlabelText] = useState<string>("");
  const [docCount, setDocCount] = useState<number>(0);

  const token = Cookies.get("adToken");
  const apiCall = async () => {
    try {
      setapiStatus(apiStatusConstants.inProgress);

      const response = await api.get(`/admin/admin/appointmentList`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);

      const data = response.data.data.appointments;

      const formattedData = data.map((item: DASHBOARDDBDATA) => ({
        id: item.id,
        appointmentDay: item.appointment_day,
        appointmentHour: item.appointment_hour,
        patientImage: item.patient_img_url,
        patientName: item.patient_name,
        status: item.status,
        appointmentDate: item.appointment_date,
        docImg: item.doc_img_url,
        doctorName: item.doctor_name,
      }));

      setData(formattedData);
      setAppointLen(formattedData.length);
      setDocCount(response.data.data.doctorsCount);

      const patientCount = data.filter(
        (item: DASHBOARDDBDATA) => item.status === "Completed"
      );
      setPatientCount(patientCount.length);

      setapiStatus(apiStatusConstants.success);
    } catch (error: any) {
      setapiStatus(apiStatusConstants.failure);
      console.error("Error:", error);

      if (error.response) {
        if (error.response.status === 404) {
          toast.info("No appointments found.");
        } else if (error.response.status === 500) {
          toast.error("Internal server error. Please try again later.");
        } else {
          toast.error("Error fetching appointments. Please try again.");
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
  }, [docId]);

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
              width="66px"
              height="80px"
              alt="earnings"
              src="https://res.cloudinary.com/duzolgclw/image/upload/v1727961009/General_physician_cwreoh.svg"
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
                {docCount}
              </p>
              <p style={{ color: "#515151", fontWeight: "500" }}>Doctors</p>
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
        {data.length > 0 ? renderAppointments() : <p>no new appointments</p>}
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
  // Render appointments
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
                  src={item.docImg}
                  alt={item.patientName}
                />
                <div style={{ paddingLeft: "10px" }}>
                  <p style={{ color: "black", fontWeight: "500" }}>
                    {item.doctorName}
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

  return (
    <>
      <AdminNavbar />
      <div className="adminPage">
        <AdminSidebar />
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

export default AdminDashBoard;
