import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { api } from "../config/app";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";

export interface USERINFO {
  id: string;
  name: string;
  email: string;
  password: string;
  age?: number;
  image_url?: string;
  date_of_birth?: string;
}

const Profile: React.FC = () => {
  // Separate state for each field
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [userInfo, setUserInfo] = useState<USERINFO[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    // Allow only digits, and ensure the phone number is exactly 10 digits
    if (/^\d{0,10}$/.test(phone)) {
      setPhone(phone);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "address") setAddress(value);
    if (name === "gender") setGender(value);
    if (name === "birthday") setBirthday(value);
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

  const handleImageClick = () => {
    document.getElementById("sigma-file")?.click();
  };

  const toggleEdit = () => {
    if (isEditing) {
      console.log("Profile saved:", {
        name,
        email,
        phone,
        address,
        gender,
        birthday,
      });
    }
    setIsEditing(!isEditing);
  };

  const getUserData = async () => {
    try {
      const token = Cookies.get("presToken");
      if (!token) {
        toast.info("Log in to book Appointment");
        return;
      }

      const response = await api.get("/user/user-info", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = response.data.data[0];
      setUserInfo(response.data.data);
      setName(user.name);
      setEmail(user.email);
      setImageUrl(user.image_url);
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setGender(user.gender || "");
      setBirthday(user.date_of_birth || "");
      setPhone(user.phone_num || "");
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Your session has expired. Please log in again.");
        } else {
          toast.error(
            error.response?.data?.message ||
              "Something went wrong while fetching user data."
          );
        }
      } else {
        toast.error("Unexpected error occurred. Please try again.");
      }
    }
  };

  const handleSave = async () => {
    if (!name || !email) {
      toast.error("Name and email are required!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone || "");
    formData.append("address", address || "");
    formData.append("gender", gender || "");
    formData.append("birthday", birthday || "");
    formData.append("prevImageUrl", imageUrl);

    if (imageFile) {
      formData.append("profileImage", imageFile);
    }

    try {
      const token = Cookies.get("presToken");

      if (!token) {
        toast.error("Authentication token not found. Please log in again.");
        return;
      }

      const response = await api.put("/user/update-profile/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setIsEditing(false);

      if (response.status === 200) {
        console.log(response);
        toast.success(response.data.message || "Profile updated successfully!");
        await getUserData();
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

  const saveButton = () => {
    return (
      <button onClick={handleSave} className="edit-button">
        Save
      </button>
    );
  };

  const editButton = () => {
    return (
      <button onClick={() => setIsEditing(true)} className="edit-button">
        Edit
      </button>
    );
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="u-profile-container">
        <div className="user-profile-padding">
          <div className="profile-header">
            {isEditing ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "5px",
                  paddingBottom: "0px",
                }}
              >
                <div
                  onClick={handleImageClick}
                  style={{ width: "100px", cursor: "pointer" }}
                >
                  <img
                    id="sigma"
                    width="100px"
                    height="100px"
                    src={
                      imageUrl
                        ? imageUrl
                        : "https://res.cloudinary.com/duzolgclw/image/upload/v1727961073/upload_area_ep8jrb.png"
                    }
                    alt="Profile"
                  />
                </div>
                <input
                  id="sigma-file"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "20px",
                  }}
                >
                  <label className="info-label">Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleNameChange}
                    className="edit-input"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "5px",
                }}
              >
                <img
                  width="100px"
                  height="100px"
                  src={
                    imageUrl ||
                    "https://res.cloudinary.com/duzolgclw/image/upload/v1727961073/upload_area_ep8jrb.png"
                  }
                  alt="Profile"
                  style={{ cursor: "pointer" }}
                  onClick={handleImageClick}
                />
                <h2 className="profile-name">{name}</h2>
              </div>
            )}
          </div>

          <div className="divider"></div>
          <div className="contact-info-section">
            <p className="section-title">Contact Information</p>
            <br />
            <label className="info-label">Email id:</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                className="edit-input"
                placeholder="Enter your email"
              />
            ) : (
              <span className="info-value">{email}</span>
            )}
            <br />
            <br />

            <label className="info-label">Phone:</label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={phone}
                onChange={handlePhoneChange}
                className="edit-input"
                placeholder="Enter your phone number"
                maxLength={10}
              />
            ) : (
              <span className="info-value">{phone}</span>
            )}
            <br />
            <br />

            <label className="info-label">Address:</label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={address}
                onChange={handleChange}
                className="edit-input"
                placeholder="Enter your address"
              />
            ) : (
              <span className="info-value">{address}</span>
            )}
          </div>
          <div className="basic-info-section">
            <p className="section-title">Basic Information</p>
            <br />
            <label className="info-label">Gender:</label>
            {isEditing ? (
              <select
                name="gender"
                value={gender}
                onChange={handleChange}
                className="edit-input"
              >
                <option value="Not Selected">Not Selected</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <span className="info-value">{gender}</span>
            )}
            <br />
            <br />
            <label className="info-label">Birthday:</label>
            {isEditing ? (
              <input
                type="date"
                name="birthday"
                value={birthday || ""}
                onChange={handleChange}
                className="edit-input"
              />
            ) : (
              <span className="info-value">{birthday}</span>
            )}
          </div>
          <br />
          {isEditing ? saveButton() : editButton()}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Profile;
