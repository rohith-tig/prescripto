import React, { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { api } from "../config/app";
import "../styles/adddoctor.css";

import { docData } from "./Appointment";
import { GoDotFill, GoInfo } from "react-icons/go";
import { MdVerified } from "react-icons/md";

import AdminSidebar from "../components/AdminSidebar";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";

const AdminDocProfile: React.FC = () => {
  const [data, setData] = useState<docData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [about, setAbout] = useState("");
  const [fees, setFees] = useState<number>(0);
  const [adrLine1, setAdrLine1] = useState("");
  const [adrLine2, setAdrLine2] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { id } = useParams();
  const [checkValue, setCheckValue] = useState<boolean>();
  console.log(id);
  const token = Cookies.get("adToken");
  const apiCall = async () => {
    try {
      const response = await api.get(`/admin/doctor/doctorp/${id}`);
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
      setImageUrl(formattedData.image);
      setCheckValue(formattedData.availability);
    } catch (error: any) {
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
    apiCall();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
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
      formData.append("Image", imageFile);
    }

    try {
      if (!token) {
        toast.error("Authentication token not found. Please log in again.");
        return;
      }

      const response = await api.put(
        `/admin/admin/update-profile/${id}`,
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
    }
  };

  const handleImageClick = () => {
    document.getElementById("sigma-file")?.click();
  };
  const handleCheckboxChange = () => {
    setCheckValue((prev) => !prev);
  };
  return (
    <>
      <AdminNavbar />
      <div className="adminPage">
        <AdminSidebar />
        <div className="add-doctor-cont">
          <h1 className="gurbha">All Appointments</h1>
          <div className="django">
            <div className="d-a-f-d">
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
                        onChange={(e) => setFees(Number(e.target.value))}
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
              </div>
            </div>
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
              {isEditing ? (
                <div className="jjk">
                  <button className="beta" onClick={handleSaveClick}>
                    Save
                  </button>

                  <button className="beta" onClick={handleSaveClick}>
                    Cancel
                  </button>
                </div>
              ) : (
                <button className="beta" onClick={handleEditClick}>
                  Edit
                </button>
              )}
            </div>
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

export default AdminDocProfile;
