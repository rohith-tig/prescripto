import React, { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import DataTable from "react-data-table-component";
import { api } from "../config/app";
import "../styles/adddoctor.css";
import AdminSidebar from "../components/AdminSidebar";
import Cookies from "js-cookie";
import { TailSpin } from "react-loader-spinner";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface AppointmentData {
  appointId: string;
  doctorId: string;
  doctorName: string;
  image: string;
  fees: number;
  patientId: string;
  department: string;
  appointmentDate: string;
  appointmentDay: string;
  appointmentHour: string;
  adrLine1: string;
  adrLine2: string;
  status: string;
  patientName: string;
  patientAge?: number | null;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentData | null>(null);
  const [apiStatus, setapiStatus] = useState<string>(
    apiStatusConstants.initial
  );
  const navigate = useNavigate();
  const [appointId, setAppointId] = useState<string>("");
  const [patientName, setPatientName] = useState<string>("");
  const [chika, setChika] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>("");
  const [labelText, setlabelText] = useState<string>("");
  const rowsPerPage = 10;
  const [doctorId, setdoctorId] = useState<string>("");
  const [fees, setfees] = useState<number>(0);
  const [completeLoading, setCompleteLoading] = useState<string | null>(null);
  const [chimki, setChimki] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isCancel, setisCancel] = useState<string | null>(null);
  const [compi, setCompi] = useState<boolean>(false);
  const [canci, setCanci] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);
  const [kit, setKit] = useState<boolean>(false);
  const token = Cookies.get("adToken");
  const apiCall = async () => {
    try {
      setapiStatus(apiStatusConstants.inProgress);

      const response = await api.get(`/admin/admin/appointmentList`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const apiData = response.data.data.appointments;

      const formattedData = apiData.map((item: any) => ({
        appointId: item.id,
        doctorId: item.doctor_id,
        doctorName: item.doctor_name,
        image: item.doc_img_url,
        fees: item.fees,
        patientId: item.patient_id,
        department: item.department,
        appointmentDate: item.appointment_date,
        appointmentDay: item.appointment_day,
        appointmentHour: item.appointment_hour,
        adrLine1: item.adr_line1,
        adrLine2: item.adr_line2,
        status: item.status,
        patientName: item.patient_name,
        patientAge: item.patient_age,
      }));
      setData(formattedData);
      await adminApicall();
      setapiStatus(apiStatusConstants.success);
      console.log("Fetched Data:", formattedData);
    } catch (error: any) {
      setapiStatus(apiStatusConstants.failure);
      console.error("Error:", error);

      if (error.response) {
        if (error.response.status === 500) {
          toast.error("Internal server error. Please try again later.");
        } else if (error.response.data.message === "Invalid JWT Token") {
          navigate("/admin-login");
        } else {
          toast.error("Error fetching appointments. Please try again.");
        }
      } else if (error.request || error.code === "ERR_NETWORK") {
        toast.error(
          "Network error. Please check your connection and try again."
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  useEffect(() => {
    apiCall();
  }, []);
  const adminApicall = async (): Promise<void> => {
    try {
      const response = await api.get("/admin/admin-details", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRole(response.data.data.role);
    } catch (error) {
      console.error(error);
    }
  };

  const updateAppointmentStatus = async (
    appointmentId: string
  ): Promise<void> => {
    try {
      const response = await api.put(
        `/admin/patient/${appointmentId}/completedStatus`,
        {
          status: "completed",
        }
      );
      await apiCall();
      console.log(`API response for ${appointmentId}:`, response.data);
      console.log(`Appointment ${appointmentId} marked as completed.`);
    } catch (error) {
      console.error(`Error updating appointment ${appointmentId}:`, error);
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

  const deleteAppointment = async () => {
    try {
      setIsDeleting(appointId);
      const response = await api.delete(
        `/admin/delete-appointment/${appointId}`,
        {
          data: { patientName },
        }
      );
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
      setIsDeleting(null);
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
  const deleteUI = () => {
    return (
      <div className="simbi">
        <div className="simbi1">
          <h3>Delete {patientName}'s Appointment?</h3>
          <div className="simbi2">
            <button
              onClick={() => {
                deleteAppointment();
                setChimki(false);
              }}
              className="yes-button"
            >
              Delete
            </button>
            <button
              onClick={() => {
                setChimki(false);
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

  const deleteRender = () => {
    if (role === "editor") {
      setKit(true);
    } else {
      setChimki(true); // Open modal
    }
  };

  const editorRender = () => {
    return (
      <div className="simbi">
        <div className="simbi1">
          <h3>authorisesd</h3>
          <div className="simbi2">
            <button
              onClick={() => {
                setKit(false);
                setlabelText("");
              }}
              className="close-button"
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    );
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
  const StatusCs = (status: string) => {
    switch (status) {
      case (status = "waiting"):
        return "yellowstop";
      case (status = "Confirmed"):
        return "greenstop";
      case (status = "Cancelled"):
        return "Redstop";
      case (status = "Completed"):
        return "bluestop";
    }
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
      selector: (row: AppointmentData) => row.patientName,
      sortable: true,
      style: {
        borderRight: "1px solid #ddd",
        borderLeft: "1px solid #ddd",
        overflow: "visible",
        whiteSpace: "normal",
        textOverflow: "clip",
        width: "150px",
      },
    },

    {
      name: "Date & Time",
      selector: (row: AppointmentData) =>
        `${row.appointmentDate} & ${row.appointmentHour}:00`,
      sortable: true,
      style: {
        borderRight: "1px solid #ddd",
        borderLeft: "1px solid #ddd",
        overflow: "hidden",
        minWidth: "150px",
        whiteSpace: "nowrap",
        textOverflow: "clip",
      },
    },
    {
      name: "Doctor",
      selector: (row: AppointmentData) => row.doctorName,
      sortable: true,
      style: {
        borderRight: "1px solid #ddd",
        borderLeft: "1px solid #ddd",
        overflow: "visible",
        whiteSpace: "normal",
        minWidth: "150px",
        textOverflow: "clip",
      },
    },
    {
      name: "Status",
      selector: (row: AppointmentData) => row.status,
      sortable: true,
      className: (row: AppointmentData) => {
        const className = StatusCs(row.status);
        console.log("Row status class:", className); // Log the class being applied
        return className;
      },
      style: {
        borderRight: "1px solid #ddd",
        borderLeft: "1px solid #ddd",
        overflow: "hidden",
        whiteSpace: "nowrap",
        width: "90px",
        minWidth: "80px",
        textOverflow: "clip",
      },
    },
    {
      name: "Action",
      cell: (row: AppointmentData) => (
        <>
          <div className="action-buttons">
            <div style={{ display: "flex", flexDirection: "row" }}>
              <button className="show-full-info" onClick={() => openModal(row)}>
                Show Full Info
              </button>
              <button
                disabled={labelText === "Delete"}
                className="delll"
                onClick={() => {
                  setPatientName(row.patientName);
                  setAppointId(row.appointId);
                  setlabelText("Delete");
                  deleteRender();
                }}
              >
                {isDeleting === row.appointId ? "Deleting..." : "Delete"}
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
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
              <button
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
        minWidth: "265px",
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
      <AdminNavbar />
      <div className="adminPage">
        <AdminSidebar />
        <div className="add-doctor-cont">
          <h1 className="gurbha">All Appointments</h1>
          <div className="afmc">{renderPrescriptoPage()}</div>
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

      {chimki && deleteUI()}
      {compi && completerender()}
      {canci && cancelrender()}
      {kit && editorRender()}
      <ToastContainer />
    </>
  );
};

export default DoctorAppointmentList;
