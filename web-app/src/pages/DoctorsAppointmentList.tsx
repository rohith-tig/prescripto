import React, { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import DoctorSidebar from "../components/DoctorSidebar";
import DataTable from "react-data-table-component";
import { api } from "../config/app";
import "../styles/adddoctor.css";
import Cookies from "js-cookie";
import { TailSpin } from "react-loader-spinner";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DoctorNavbar from "../components/DoctorNavbar";

interface AppointmentData {
  appointId: string;
  doctorName: string;
  doctorId: string;
  image: string;
  department: string;
  appointmentDate: string;
  appointmentDay: string;
  appointmentHour: string;
  adrLine1: string;
  adrLine2: string;
  status: string;
  patientName: string;
  fees: number;
  patientAge: number | null;
}
const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const DoctorAppointmentList: React.FC = () => {
  const [data, setData] = useState<AppointmentData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [apiStatus, setapiStatus] = useState<string>(
    apiStatusConstants.initial
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [completeLoading, setCompleteLoading] = useState<string | null>(null);
  const [chimki, setChimki] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isCancel, setisCancel] = useState<string | null>(null);
  const [compi, setCompi] = useState<boolean>(false);
  const [fees, setfees] = useState<number>(0);
  const [canci, setCanci] = useState<boolean>(false);
  const [chika, setChika] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>("");
  const [labelText, setlabelText] = useState<string>("");
  const [appointId, setAppointId] = useState<string>("");
  const [patientName, setPatientName] = useState<string>("");
  const [doctorId, setdoctorId] = useState<string>("");
  const token = Cookies.get("docToken");
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentData | null>(null);
  const navigate = useNavigate();
  if (!token) {
    navigate("/doctor-login");
  }
  const apiCall = async () => {
    try {
      setapiStatus(apiStatusConstants.inProgress);

      const response = await api.get("/admin/doctor/appointmentList", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const apiData = response.data.data;

      const formattedData = apiData.map((item: any) => ({
        appointId: item.id,
        doctorId: item.doctor_id,
        doctorName: item.doctor_name,
        image: item.doc_img_url,
        department: item.department,
        appointmentDate: item.appointment_date,
        appointmentDay: item.appointment_day,
        appointmentHour: item.appointment_hour,
        adrLine1: item.adr_line1,
        adrLine2: item.adr_line2,
        status: item.status,
        fees: item.fees,
        patientName: item.patient_name,
        patientAge: item.patient_age ?? "N/A",
      }));
      setData(formattedData);
      setapiStatus(apiStatusConstants.success);
    } catch (error: any) {
      setapiStatus(apiStatusConstants.failure);
      console.error(error);

      if (error.request || error.code === "ERR_NETWORK") {
        toast.error(
          "Network error. Please check your connection and try again."
        );
      } else if (error.response?.status === 401) {
        window.location.href = "/doctor-login";
      } else if (
        error.message ===
        "Authentication token is missing. Please log in again."
      ) {
        window.location.href = "/doctor-login";
      } else {
        toast.error("An Unexpected error occurred. Please try again.");
      }
    }
  };
  useEffect(() => {
    apiCall();
  }, []);

  const openModal = (appointment: AppointmentData) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const cancelAppointment = async () => {
    try {
      setisCancel(appointId);
      const response = await api.put(`/admin/patient/${appointId}/status`, {
        doctorId,
        patientName,
        statusText,
        fees,
      });
      console.log(response);

      if (response.status === 200) {
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
    } finally {
      setisCancel(null);
      setlabelText("");
    }
  };

  const completeAppointment = async () => {
    try {
      setCompleteLoading(appointId);
      const response = await api.put(`/admin/patient/${appointId}/status`, {
        doctorId,
        patientName,
        statusText,
        fees,
      });
      console.log(response);

      if (response.status === 200) {
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
    } finally {
      setCompleteLoading(null);
      setlabelText("");
    }
  };
  const completerender = () => {
    return (
      <div className="simbi">
        <div className="simbi1">
          <h3>
            {labelText} {patientName}'s Appointment?
          </h3>
          <div className="simbi2">
            <button
              onClick={() => {
                completeAppointment();
                setCompi(false);
              }}
              className="yes-button"
            >
              Yes
            </button>
            <button
              onClick={() => {
                setCompi(false);
                setlabelText("");
              }}
              className="close-button"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };
  const cancelrender = () => {
    return (
      <div className="simbi">
        <div className="simbi1">
          <h3>
            {labelText} {patientName}'s Appointment?
          </h3>
          <div className="simbi2">
            <button
              onClick={() => {
                cancelAppointment();
                setCanci(false);
              }}
              className="yes-button"
            >
              Yes
            </button>
            <button
              onClick={() => {
                setCanci(false);
                setlabelText("");
              }}
              className="close-button"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const columns = [
    {
      name: "#",
      cell: (_: AppointmentData, index: number) =>
        (currentPage - 1) * rowsPerPage + index + 1,
      width: "50px",
      style: {
        borderRight: "1px solid #ddd",
        borderLeft: "1px solid #ddd",
        textAlign: "center",
        width: "50px",
      },
    },
    {
      name: "Patient Name",
      selector: (row: AppointmentData) => row.patientName, // Assuming patientName exists in your AppointmentData
      sortable: true,
      style: {
        borderRight: "1px solid #ddd",
        borderLeft: "1px solid #ddd",
        overflow: "visible", // Allow content to overflow
        whiteSpace: "normal", // Allow wrapping
        textOverflow: "clip",
        width: "150px", // No ellipsis
      },
    },
    {
      name: "Patient Age",
      selector: (row: AppointmentData) => row.patientAge,
      sortable: true,
      width: "120px",
      style: {
        borderRight: "1px solid #ddd",
        borderLeft: "1px solid #ddd",
        overflow: "hidden",
        whiteSpace: "nowrap", // Prevent wrapping
        textOverflow: "clip",
        // No ellipsis
      },
    },

    {
      name: "Date & Time",
      selector: (row: AppointmentData) =>
        row.appointmentDate + " " + row.appointmentHour,
      sortable: true,
      style: {
        borderRight: "1px solid #ddd",
        borderLeft: "1px solid #ddd",
        overflow: "hidden",
        whiteSpace: "nowrap", // Prevent wrapping
        textOverflow: "clip", // No ellipsis
      },
    },

    {
      name: "Status",
      selector: (row: AppointmentData) => row.status,
      sortable: true,
      style: {
        borderRight: "1px solid #ddd",
        borderLeft: "1px solid #ddd",
        overflow: "hidden",
        whiteSpace: "nowrap", // Prevent wrapping
        textOverflow: "clip", // No ellipsis
      },
    },
    {
      name: "Action",
      cell: (row: AppointmentData) => (
        <>
          <div className="action-buttons">
            <div style={{ display: "flex", flexDirection: "row" }}>
              <button
                style={{ marginRight: "10px" }}
                className="show-full-info"
                onClick={() => openModal(row)}
              >
                Show Full Info
              </button>
              <button
                disabled={labelText === "Complete"}
                className={row.status === "Confirmed" ? "sambala" : "chutki"}
                onClick={() => {
                  setlabelText("Complete");
                  setdoctorId(row.doctorId);
                  setAppointId(row.appointId);
                  setPatientName(row.patientName);
                  setStatusText("Completed");
                  setfees(row.fees);
                  setCompi(true);
                }}
              >
                {completeLoading === row.appointId
                  ? "updating..."
                  : "Mark as Complete"}
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <button
                style={{ marginLeft: "-1px", width: "110px" }}
                className={row.status === "Confirmed" ? "delll" : "chutki"}
                disabled={labelText === "Cancel"}
                onClick={() => {
                  setlabelText("Cancel");
                  setAppointId(row.appointId);
                  setPatientName(row.patientName);
                  setStatusText("Cancelled");
                  setCanci(true);
                }}
              >
                {isCancel === row.appointId ? "Cancelling..." : "Cancel"}
              </button>
            </div>
          </div>
        </>
      ),
      style: {
        borderRight: "1px solid #ddd",
        borderLeft: "1px solid #ddd",
        overflow: "hidden",
        whiteSpace: "nowrap",
        minWidth: "285px",
        textOverflow: "clip",
      },
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const renderLoadingView = () => (
    <div
      style={{
        display: "flex",
        marginTop: "100px",
        alignItems: "center",
        justifyContent: "center",
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
    <DataTable
      columns={columns}
      data={data}
      pagination
      paginationPerPage={rowsPerPage}
      highlightOnHover
      pointerOnHover
      striped
      keyField="appointId"
      onChangePage={handlePageChange}
    />
  );
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
          <h1 className="gurbha">All Appointments</h1>
          <div className="django">{renderPrescriptoPage()}</div>
        </div>
      </div>
      {isModalOpen && selectedAppointment && (
        <div className="modal-container">
          <div className="modal-content">
            <button onClick={closeModal} className="modal-close-btn">
              &times;
            </button>
            <h2 className="modal-title">Appointment Details</h2>

            <p className="modal-info">
              <span>Doctor Name:</span>
              {selectedAppointment.doctorName}
            </p>
            <p className="modal-info">
              <span>Patient Name:</span>
              {selectedAppointment.patientName}
            </p>
            <p className="modal-info">
              <span>Appointment Date:</span>
              {selectedAppointment.appointmentDate}
            </p>
            <p className="modal-info">
              <span>Appointment Day:</span>
              {selectedAppointment.appointmentDay}
            </p>
            <p className="modal-info">
              <span>Appointment Hour:</span>
              {selectedAppointment.appointmentHour}
            </p>
            <p className="modal-info">
              <span>Status:</span> {selectedAppointment.status}
            </p>
            <p className="modal-info">
              <span>Address:</span> {selectedAppointment.adrLine1}
            </p>
            <p className="modal-info">
              {selectedAppointment.adrLine2 && <span>Additional Address:</span>}
              {selectedAppointment.adrLine2}
            </p>
          </div>
        </div>
      )}

      {compi && completerender()}
      {canci && cancelrender()}
      <ToastContainer />
    </>
  );
};

export default DoctorAppointmentList;
