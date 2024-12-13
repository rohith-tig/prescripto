import React from "react";
import Navbar from "../components/Navbar";
import "../styles/appointment.css";
import { useEffect, useState } from "react";
import { api } from "../config/app";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { GoDotFill } from "react-icons/go";

export interface APPOINTMENTDATA {
  appointId: string;
  doctorName: string;
  image: string;
  department: string;
  appointmentDate: string;
  appointmentDay: string;
  appointmentHour: number;
  adrLine1: string;
  adrLine2: string;
  status: string;
}
export interface DBAPPOINTMENTDATA {
  id: string;
  doctor_name: string;
  doc_img_url: string;
  department: string;

  appointment_date: string;
  appointment_day: string;
  appointment_hour: number;
  adr_line1: string;
  adr_line2: string;
  status: string;
}

const MyAppointment: React.FC = () => {
  const [data, setData] = useState<APPOINTMENTDATA[]>([]);
  const [canci, setCanci] = useState<boolean>(false);

  const apiCall = async () => {
    const token = Cookies.get("presToken");
    console.log("token", token);

    if (!token) {
      console.error("Token is missing. Please log in again.");

      return;
    }

    try {
      const response = await api.get("/user/get-appointments", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const data = await response.data.data;

      const formattedData = data.map((item: DBAPPOINTMENTDATA) => ({
        appointId: item.id,
        doctorName: item.doctor_name,
        image: item.doc_img_url,
        department: item.department,
        appointmentDate: item.appointment_date,
        appointmentDay: item.appointment_day,
        appointmentHour: item.appointment_hour,
        adrLine1: item.adr_line1,
        adrLine2: item.adr_line2,
        status: item.status,
      }));

      setData(formattedData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error fetching appointments:",
          error.response?.data.message || error.message
        );
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  useEffect(() => {
    apiCall();
  }, []);

  const cancelAppointment = async (id: string, status: string) => {
    try {
      const response = await api.put(`/user/cancel-appointment/${id}`, {
        status: "Cancelled",
      });
      console.log(response);
      await apiCall();
    } catch (error) {
      console.error(error);
    }
  };

  const canNot = () => (
    <div className="simbi">
      <div className="simbi1">
        <h3>
          Your appointment is confirmed. If you need to cancel, please contact
          our support team at [prescripto@gmail.com] for assistance.
        </h3>
        <div className="simbi2">
          <button
            onClick={() => {
              setCanci(false);
            }}
            className="yes-button"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );

  const canelApp = (id: string, status: string) => {
    if (status === "Confirmed") {
      console.log(status);
      setCanci(true);
    } else {
      cancelAppointment(id, status);
    }
  };

  const renderCancel = (status: string) => {
    switch (status) {
      case (status = "Waiting"):
        return "konka";
      case (status = "Confirmed"):
        return "konka";
      case (status = "Cancelled"):
        return "banka";
      case (status = "Completed"):
        return "banka";
    }
  };

  const StatusCss = (status: string) => {
    switch (status) {
      case (status = "Waiting"):
        return "yellowstop";
      case (status = "Confirmed"):
        return "greenstop";
      case (status = "Cancelled"):
        return "Redstop";
      case (status = "Completed"):
        return "bluestop";
    }
  };

  const renderAppointments = () => {
    return (
      <>
        {data.map((item) => {
          const date = new Date(item.appointmentDate).toDateString();

          return (
            <div key={item.appointId} className="ap-container">
              <div className="ap-img-cont">
                <img
                  className="ap-image"
                  alt={item.doctorName}
                  src={item.image}
                />
              </div>
              <div className="apDetails">
                <h1 style={{ fontSize: "18px" }}>{item.doctorName}</h1>
                <p
                  style={{
                    marginTop: "-10px",
                    color: "#4b5563",
                    fontSize: "15px",
                  }}
                >
                  {item.department}
                </p>
                <p
                  style={{
                    marginTop: "-10px",
                    color: "#4b5563",
                    fontSize: "15px",
                    fontWeight: "500",
                  }}
                >
                  Address:
                </p>
                <p
                  style={{
                    marginTop: "-10px",
                    color: "#4b5563",
                    fontSize: "14px",
                  }}
                >
                  {item.adrLine1}
                </p>
                <p
                  style={{
                    marginTop: "-10px",
                    color: "#4b5563",
                    fontSize: "14px",
                  }}
                >
                  {item.adrLine2}
                </p>
                <p
                  style={{
                    marginTop: "-8px",
                    color: "#4b5563",
                    fontSize: "14px",
                  }}
                >
                  <span
                    style={{
                      marginTop: "-10px",
                      color: "#4b5563",
                      fontSize: "16px",
                      fontWeight: "500",
                    }}
                  >
                    Date:
                  </span>
                  {date}
                </p>
                <p
                  style={{
                    marginTop: "-8px",
                    color: "#4b5563",
                    fontSize: "14px",
                  }}
                >
                  <span
                    style={{
                      marginTop: "-10px",
                      color: "#4b5563",
                      fontSize: "16px",
                      fontWeight: "500",
                    }}
                  >
                    Time:
                  </span>
                  {item.appointmentHour}:00
                </p>
                <p
                  style={{
                    marginTop: "-10px",
                    color: "#4b5563",
                    fontSize: "14px",
                  }}
                >
                  <span
                    style={{
                      marginTop: "-10px",
                      color: "#4b5563",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    Status:
                  </span>
                  <span className={StatusCss(item.status)}>{item.status}</span>
                </p>
                <div className="singamalai">
                  <button
                    onClick={() => {
                      canelApp(item.appointId, item.status);
                    }}
                    className={renderCancel(item.status)}
                  >
                    cancel Appointment
                  </button>
                </div>
              </div>
              <div className="auto-align">
                <button
                  onClick={() => {
                    canelApp(item.appointId, item.status);
                  }}
                  className={renderCancel(item.status)}
                >
                  cancel Appointment
                </button>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  const empty = () => (
    <div style={{ textAlign: "center" }}>
      <h1 style={{ color: "#07bc0c", fontSize: "25px" }}>
        No appointments yet. Schedule your first appointment today!
      </h1>
      <img
        className="emp"
        src="https://res.cloudinary.com/duzolgclw/image/upload/v1732520050/calendar-23684_1920_cmiaf5.png"
      />
    </div>
  );
  return (
    <>
      <Navbar />
      <div className="appoint-width">
        <div className="responsive-appoint-cont">
          <h1 style={{ textAlign: "center" }} className="ap-heading">
            My appointments
          </h1>
          {data.length > 0 ? renderAppointments() : empty()}
        </div>
      </div>
      {canci && canNot()}
    </>
  );
};

export default MyAppointment;
