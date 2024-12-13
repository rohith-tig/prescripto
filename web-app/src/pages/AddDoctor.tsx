import React, { useState, useRef } from "react";
import "../styles/adddoctor.css";
import Select from "react-dropdown-select";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import axios from "axios";
import { api } from "../config/app";
import { toast, ToastContainer } from "react-toastify";

interface EXPOPTIONS {
  label: string;
  value: string;
}
interface SPECIALITY {
  label: string;
  value: string;
}

export const specialityList: SPECIALITY[] = [
  { label: "General physician", value: "General physician" },
  { label: "Gynecologist", value: "Gynecologist" },
  { label: "Dermatologist", value: "Dermatologist" },
  { label: "Pediatricians", value: "Pediatricians" },
  { label: "Neurologist", value: "Neurologist" },
  { label: "Gastroenterologist", value: "Gastroenterologist" },
];

const expOptions: EXPOPTIONS[] = [
  { label: "1 Year", value: "1 year" },
  { label: "2 Years", value: "2 years" },
  { label: "3 Years", value: "3 years" },
  { label: "4 Years", value: "4 years" },
  { label: "5 Years", value: "5 years" },
  { label: "6 Years", value: "6 years" },
  { label: "7 Years", value: "7 years" },
  { label: "8 Years", value: "8 years" },
  { label: "9 Years", value: "9 years" },
  { label: "10 Years", value: "10 years" },
];

const AddDoctor: React.FC = () => {
  const smNavRef = useRef<HTMLDivElement>(null);

  const [selectedData, setSelectedData] = useState({
    experience: expOptions[0],
    speciality: specialityList[0],
    file: null as File | null,
  });

  const [formData, setFormData] = useState({
    doctorName: "",
    doctorEmail: "",
    doctorPassword: "",
    doctorFees: "",
    doctorDegree: "",
    address1: "",
    address2: "",
    aboutDoctor: "",
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files && files.length > 0) {
      setSelectedData((prevData) => ({ ...prevData, file: files[0] }));
    }
  };

  const handleSpecialityChange = (values: SPECIALITY[]) => {
    setSelectedData((prevData) => ({
      ...prevData,
      speciality: values[0] || null,
    }));
  };

  const handleExperienceChange = (values: EXPOPTIONS[]) => {
    setSelectedData((prevData) => ({
      ...prevData,
      experience: values[0] || null,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (
      !formData.aboutDoctor ||
      formData.address1 ||
      formData.address2 ||
      formData.doctorDegree ||
      formData.doctorEmail ||
      formData.doctorFees ||
      formData.doctorName ||
      formData.doctorPassword ||
      selectedData.file
    ) {
      toast.warning("Please fill all the fields!");
      return;
    }

    const dataToSend = new FormData();
    if (selectedData.file) {
      dataToSend.append("file", selectedData.file);
    }
    dataToSend.append("name", formData.doctorName);
    dataToSend.append("email", formData.doctorEmail);
    dataToSend.append("password", formData.doctorPassword);
    dataToSend.append("speciality", selectedData.speciality?.value || "");
    dataToSend.append("experience", selectedData.experience?.value || "");
    dataToSend.append("fees", formData.doctorFees);
    dataToSend.append("degree", formData.doctorDegree);
    dataToSend.append("address1", formData.address1);
    dataToSend.append("address2", formData.address2);
    dataToSend.append("about", formData.aboutDoctor);

    try {
      const response = await api.post("/admin/add-doctor", dataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data.message);
    } catch (error) {
      console.error("Error adding doctor:", error);
    }
  };

  const handleImageClick = () => {
    document.getElementById("file-input")?.click();
  };
  return (
    <>
      <AdminNavbar />
      <div className="adminPage">
        <AdminSidebar />
        <div className="add-doctor-cont">
          <h1 className="gurbha">Add Doctor</h1>
          <form onSubmit={handleSubmit} className="form-container">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <img
                src={
                  selectedData.file
                    ? URL.createObjectURL(selectedData.file)
                    : "https://res.cloudinary.com/duzolgclw/image/upload/v1727961009/General_physician_cwreoh.svg"
                }
                alt="Doctor Avatar"
                className="avatar-image"
              />
              <p onClick={handleImageClick} className="upload-text">
                Upload doctor picture
              </p>

              <input
                type="file"
                id="file-input"
                className="file-input"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>

            <div className="input-cont">
              <div className="st-part">
                <label className="label-css" htmlFor="doctorName">
                  Doctor Name
                </label>
                <br />
                <input
                  placeholder="Name"
                  className="input-css"
                  id="doctorName"
                  name="doctorName"
                  type="text"
                  value={formData.doctorName}
                  onChange={handleChange}
                />
                <label className="label-css" htmlFor="doctorEmail">
                  Doctor Email
                </label>
                <br />
                <input
                  placeholder="Email"
                  className="input-css"
                  id="doctorEmail"
                  name="doctorEmail"
                  type="email"
                  value={formData.doctorEmail}
                  onChange={handleChange}
                />
                <label className="label-css" htmlFor="doctorPassword">
                  Set Password
                </label>
                <br />
                <input
                  placeholder="Password"
                  className="input-css"
                  id="doctorPassword"
                  name="doctorPassword"
                  type="password"
                  value={formData.doctorPassword}
                  onChange={handleChange}
                />
                <label className="label-css">Experience</label>
                <Select
                  style={{
                    marginTop: "5px",
                    marginBottom: "23px",
                    borderRadius: "5px",
                  }}
                  dropdownPosition="auto"
                  values={
                    selectedData.experience ? [selectedData.experience] : []
                  }
                  onChange={handleExperienceChange}
                  options={expOptions}
                />
                <label className="label-css" htmlFor="doctorFees">
                  Set Fees
                </label>
                <br />
                <input
                  placeholder="Fees"
                  className="input-css"
                  id="doctorFees"
                  name="doctorFees"
                  type="number"
                  value={formData.doctorFees}
                  onChange={handleChange}
                />
                <label className="label-css" htmlFor="address1">
                  Address
                </label>
                <input
                  style={{ marginBottom: "0px" }}
                  placeholder="Address 1"
                  className="input-css"
                  id="address1"
                  name="address1"
                  type="text"
                  value={formData.address1}
                  onChange={handleChange}
                />
                <input
                  style={{ marginTop: "8px" }}
                  placeholder="Address 2"
                  className="input-css"
                  id="address2"
                  name="address2"
                  type="text"
                  value={formData.address2}
                  onChange={handleChange}
                />
              </div>
              <div className="nd-part">
                <label className="label-css" htmlFor="doctorDegree">
                  Degree
                </label>
                <br />
                <input
                  placeholder="Degree"
                  className="input-css"
                  id="doctorDegree"
                  name="doctorDegree"
                  type="text"
                  value={formData.doctorDegree}
                  onChange={handleChange}
                />
                <label className="label-css">Speciality</label>
                <Select
                  style={{
                    marginTop: "5px",
                    marginBottom: "23px",
                    borderRadius: "5px",
                  }}
                  dropdownPosition="auto"
                  values={
                    selectedData.speciality ? [selectedData.speciality] : []
                  }
                  onChange={handleSpecialityChange}
                  options={specialityList}
                />

                <br />
              </div>
            </div>
            <label className="label-css" htmlFor="aboutDoctor">
              About
            </label>
            <br />
            <textarea
              style={{ height: "100px" }}
              placeholder="Write about doctor..."
              className="input-css"
              id="aboutDoctor"
              name="aboutDoctor"
              rows={5}
              cols={50}
              value={formData.aboutDoctor}
              onChange={handleChange}
            ></textarea>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <button className="vanch" type="submit">
                submit
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AddDoctor;
