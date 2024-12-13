import React, { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { api } from "../config/app";
import "../styles/adddoctor.css";
import DoctorSidebar from "../components/DoctorSidebar";
import { docData } from "./Appointment";
import { GoDotFill, GoInfo } from "react-icons/go";
import { MdVerified } from "react-icons/md";
import Cookies from "js-cookie";
import { TailSpin } from "react-loader-spinner";
import { toast, ToastContainer } from "react-toastify";
import DoctorNavbar from "../components/DoctorNavbar";
const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};
let toastShown = false;

const DoctorsProfile: React.FC = () => {
  const token = Cookies.get("docToken");
  const [data, setData] = useState<docData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [about, setAbout] = useState("");
  const [fees, setFees] = useState<number | string>(0);
  const [adrLine1, setAdrLine1] = useState("");
  const [adrLine2, setAdrLine2] = useState("");
  const [apiStatus, setapiStatus] = useState<string>(
    apiStatusConstants.initial
  );
  const [calling, setcalling] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [checkValue, setCheckValue] = useState<boolean>();

  const apiCall = async () => {
    try {
      setapiStatus(apiStatusConstants.inProgress);

      if (!token)
        throw new Error(
          "Authentication token is missing. Please log in again."
        );

      const response = await api.get("/admin/doctor-profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const dumData = response.data.data;
      const formattedData: docData = {
        id: dumData.id,
        name: dumData.name,
        email: dumData.email,
        image: dumData.doc_image_url,
        speciality: dumData.speciality,
        degree: dumData.degree,
        experience: dumData.experience,
        about: dumData.about,
        fees: dumData.fees,
        adrLine1: dumData.adr_line1,
        adrLine2: dumData.adr_line2,
        earnings: dumData.earnings,
        availability: dumData.availability,
      };

      setData(formattedData);
      setAbout(formattedData.about);
      setFees(formattedData.fees);
      setAdrLine1(formattedData.adrLine1);
      setAdrLine2(formattedData.adrLine2);
      setapiStatus(apiStatusConstants.success);
      setImageUrl(formattedData.image);
      setCheckValue(formattedData.availability);
      if (!toastShown) {
        toast.success("Doctor fetched successfully");
        toastShown = true;
      }
    } catch (error: any) {
      setapiStatus(apiStatusConstants.failure);

      if (error.request || error.code === "ERR_NETWORK") {
        toast.error(
          "Network error. Please check your connection and try again."
        );
      } else if (error.response?.status === 401) {
        toast.error("Invalid or expired token. Redirecting to login...");
        window.location.href = "/doctor-login";
      } else if (
        error.message ===
        "Authentication token is missing. Please log in again."
      ) {
        toast.error("Authentication token is missing. Please log in again.");
        window.location.href = "/doctor-login";
      } else {
        toast.error(
          "An error occurred while fetching the doctor profile. Please try again."
        );
      }
    }
  };

  useEffect(() => {
    console.log("Component mounted");
    apiCall();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };
  const handleCancelCLick = () => {
    setIsEditing(false);
  };
  const handleCheckboxChange = () => {
    setCheckValue((prev) => !prev);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveClick = async () => {
    if (!about || !fees || !adrLine1 || !adrLine2) {
      toast.warning("Please fill all the fields");
      return;
    }

    if (imageFile && imageFile.size > 5 * 1024 * 1024) {
      toast.error(
        "File size exceeds the 5MB limit. Please upload a smaller image."
      );
      return;
    }

    const formData = new FormData();
    formData.append("about", about);
    formData.append("fees", fees.toString());
    formData.append("adrLine1", adrLine1);
    formData.append("adrLine2", adrLine2);
    formData.append("prevImageUrl", imageUrl);
    formData.append("availability", checkValue ? "true" : "false");
    if (imageFile) {
      formData.append("DoctorImage", imageFile);
    }

    try {
      if (!token) {
        toast.error("Authentication token not found. Please log in again.");
        return;
      }
      setcalling(true);

      const response = await api.put(
        "/admin/doctor/update-profile/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setIsEditing(false);

      if (response.status === 200) {
        toast.success(response.data.message || "Profile updated successfully!");
        await apiCall(); // Refresh profile data
      } else {
        toast.error(response.data.message || "Failed to update profile.");
      }
    } catch (error: any) {
      if (error.response) {
        toast.error(
          error.response.data.message || "An error occurred. Please try again."
        );
        console.error("API Error:", error.response.data || error.response);
      } else if (error.request) {
        toast.error(
          "No response from the server. Please check your connection."
        );
        console.error("Request Error:", error.request);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
        console.error("Error:", error.message);
      }
    } finally {
      setcalling(false);
    }
  };

  const handleImageClick = () => {
    document.getElementById("sigma-file")?.click();
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
        {isEditing ? (
          <>
            <div onClick={handleImageClick} className="a-i-d">
              <img className="a-d-i" src={imageUrl} />
              <div className="ovrly">
                <img src="https://res.cloudinary.com/duzolgclw/image/upload/v1727961074/upload_icon_l6eq5u.png" />
                <p>Click to upload</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="a-i-d">
              <img className="a-d-i" alt={data?.name} src={imageUrl} />
            </div>
          </>
        )}
        <div className="a-100-div">
          <div className="a-d-d">
            <h1 className="name-style">
              {data?.name} <MdVerified color="#0016e1" size={19} />
            </h1>
            <p className="degree-style">
              {data?.degree} - {data?.speciality}
              <span className="exp">{data?.experience}</span>
            </p>
            <h1 className="about-style">
              About <GoInfo color="#1f2937" size={14} />
            </h1>
            {isEditing ? (
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={4}
                style={{
                  marginBottom: "10px",
                  marginLeft: "15px",
                  marginRight: "8px",
                  padding: "4px",
                }}
                className="about-para-style"
              />
            ) : (
              <p className="about-para-style">{about}</p>
            )}
            <p className="app-fee">
              Appointment fee:
              {isEditing ? (
                <input
                  type="number"
                  value={fees}
                  onChange={(e) => setFees(e.target.value)}
                  style={{ color: "#1f2937" }}
                />
              ) : (
                <span style={{ color: "#1f2937" }}>${fees}</span>
              )}
            </p>
            <p className="app-fee">
              Address:
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={adrLine1}
                    style={{ color: "#4b5563" }}
                    onChange={(e) => setAdrLine1(e.target.value)}
                  />
                  <br />
                  <input
                    type="text"
                    value={adrLine2}
                    style={{ color: "#4b5563", marginLeft: "61px" }}
                    onChange={(e) => setAdrLine2(e.target.value)}
                  />
                </>
              ) : (
                <>
                  <span style={{ color: "#4b5563" }}>{adrLine1}</span>
                  <br />
                  <span style={{ color: "#4b5563", marginLeft: "61px" }}>
                    {adrLine2}
                  </span>
                </>
              )}
            </p>
            <div
              style={{
                marginLeft: "15px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                fontSize: "18px",
                marginBottom: "10px",
              }}
            >
              {isEditing ? (
                <>
                  <input
                    onChange={handleCheckboxChange}
                    checked={checkValue}
                    id="available"
                    type="checkbox"
                  />
                  <label
                    style={{ marginLeft: "5px", marginTop: "-5px" }}
                    htmlFor="available"
                  >
                    Availability
                  </label>
                </>
              ) : data?.availability ? (
                <p
                  style={{ fontSize: "20px", paddingLeft: "0px" }}
                  className="available"
                >
                  <GoDotFill /> Available
                </p>
              ) : (
                <p className="not-available">
                  <GoDotFill /> Not-Available
                </p>
              )}
            </div>
          </div>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            {isEditing ? (
              <>
                <button
                  disabled={calling}
                  className="chintu"
                  onClick={handleSaveClick}
                >
                  {calling ? "Saving..." : "Save"}
                </button>
                <button
                  disabled={calling}
                  className="beta"
                  onClick={handleCancelCLick}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button className="chintu" onClick={handleEditClick}>
                Edit
              </button>
            )}
          </div>
        </div>
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
          <h1 className="gurbha">Doctor Profile</h1>
          <div className="django">
            <div className="d-a-f-d">{renderPrescriptoPage()}</div>
          </div>
        </div>
      </div>
      <input
        id="sigma-file"
        type="file"
        onChange={handleImageChange}
        accept="image/*"
        style={{ display: "none" }}
      />
      <ToastContainer />
    </>
  );
};

export default DoctorsProfile;
