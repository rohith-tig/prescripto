import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { MdVerified } from "react-icons/md";
import { api } from "../config/app";
import { DoctorData } from "./Home";
import "../styles/appointment.css";
import { GoDotFill, GoInfo } from "react-icons/go";
import useScrollToTop from "../components/ScrollToTop";
import Footer from "../components/Footer";
import Cookies from "js-cookie";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeDots } from "react-loader-spinner";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

export interface docData {
  id: string;
  name: string;
  email: string;
  image: string;
  speciality: string;
  degree: string;
  experience: string;
  about: string;
  fees: number;
  adrLine1: string;
  adrLine2: string;
  earnings: number;
  availability: boolean;
}

interface DateInfo {
  dayName: string;
  id: string;
  month: string;
}

interface HOURS {
  hour: number;
}

export interface USERINFO {
  id: string;
  name: string;
  email: string;
  password: string;
  age?: number;
  image_url?: string;
}

const Appointment: React.FC = () => {
  const navigate = useNavigate();
  useScrollToTop();
  const { id } = useParams<{ id: string }>();

  const [data, setData] = useState<docData | null>(null);
  const [date, setDates] = useState<DateInfo[]>([]);
  const [hours, setHours] = useState<HOURS[]>([]);
  const [bookedDate, setBookedDate] = useState<DateInfo | null>(null);
  const [relatedData, setRelatedData] = useState<DoctorData[]>([]);
  const [selectedHour, setSelectedHour] = useState<HOURS | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiStatus, setapiStatus] = useState<string>(
    apiStatusConstants.initial
  );
  const [userInfo, setUserInfo] = useState<USERINFO[]>([]);

  const handleHourClick = (hour: HOURS) => {
    setSelectedHour(hour);
  };

  const formatDates = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: "short" };
    const newDates: DateInfo[] = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const formattedDate = date.toISOString().split("T")[0];
      const dayName = date.toLocaleDateString("en-US", options);

      newDates.push({
        dayName,
        id: formattedDate,
        month: formattedDate.split("-")[2],
      });
    }

    setDates(newDates);
    setBookedDate(newDates[0]);
  };

  const getHoursDaily = (selectedDate: Date) => {
    const newHours: HOURS[] = [];
    const currentDate = new Date();
    const currentHour = currentDate.getHours();

    const isToday = selectedDate.toDateString() === currentDate.toDateString();
    let startHour = isToday ? Math.max(currentHour, 9) : 9;

    for (let i = startHour; i <= 21; i++) {
      newHours.push({ hour: i + 1 });
    }

    setHours(newHours);
  };

  const apiCall = async () => {
    try {
      setapiStatus(apiStatusConstants.inProgress);
      const response = await api.get(`/user/appointment/${id}`);

      if (response.status !== 200) {
        throw new Error("Unexpected response from server.");
      }

      const dumData = response.data.data[0];
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
      await fetchSpecialityData(formattedData.speciality);

      formatDates();
      getHoursDaily(new Date());
      setapiStatus(apiStatusConstants.success);
    } catch (error: unknown) {
      setapiStatus(apiStatusConstants.failure);
      if (error instanceof Error) {
        if (error.message.includes("Authorization header is missing")) {
          toast.error(
            "Authorization is required to access this data. Please log in."
          );
        } else if (error.message.includes("Invalid JWT Token")) {
          toast.error("Your session has expired. Please log in again.");
        } else {
          toast.error(
            error.message || "Something went wrong. Please try again."
          );
        }
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
      console.error("Error fetching appointment data:", error);
    }
  };

  const fetchSpecialityData = async (speciality: string) => {
    try {
      const response = await api.get(`/user/doctors/${speciality}`);
      const data: DoctorData[] = response.data.data;
      const filteredData = data.filter((item) => item.id !== id);
      setRelatedData(filteredData);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong while fetching the speciality data."
      );
      console.error("Error fetching speciality data:", error);
    }
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

      setUserInfo(response.data.data);
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

  useEffect(() => {
    apiCall();
  }, [id]);

  useEffect(() => {
    getUserData();
  }, []);

  const dateOnClick = (item: DateInfo) => {
    const selectedDate = new Date(item.id);
    setBookedDate(item);
    getHoursDaily(selectedDate);
  };

  const appointmentApiCall = async () => {
    const token = Cookies.get("presToken");

    if (token) {
      if (
        data &&
        bookedDate &&
        selectedHour &&
        data.adrLine1 &&
        data.adrLine2 &&
        userInfo.length > 0
      ) {
        const appointmentDetails = {
          doctorId: data.id,
          doctorName: data.name,
          image: data.image,
          department: data.speciality,
          fees: data.fees,
          appointmentDate: bookedDate.id,
          appointmentDay: bookedDate.dayName,
          appointmentHour: selectedHour.hour,
          adrLine1: data.adrLine1,
          adrLine2: data.adrLine2,
          patientName: userInfo[0].name,
          age: userInfo[0].age || null,
          status: "Waiting",
          imageUrl:
            userInfo[0].image_url ||
            "https://res.cloudinary.com/duzolgclw/image/upload/v1729690400/upload_area_shkai4.svg",
        };

        try {
          setIsLoading(true);
          const options = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };

          const response = await api.post(
            `/user/book-appointment/`,
            appointmentDetails,
            options
          );

          if (response.status === 200) {
            toast.success("Slot booked. Waiting for doctor's confirmation.");

            setTimeout(() => {
              navigate("/my-appointments");
            }, 2000);
          }
        } catch (error: any) {
          if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
              toast.error("Your session has expired. Please log in again.");
              navigate("/signup");
            } else {
              toast.error(
                error.response?.data.message ||
                  "An error occurred. Please try again."
              );
            }
          } else {
            toast.error("Unexpected error occurred. Please try again.");
            console.error("Unexpected error:", error);
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        toast.error("Please choose a time slot.");
      }
    } else {
      toast.error("You need to be logged in to book an appointment.");
      navigate("/signup");
    }
  };
  const renderAvailable = () => {
    return (
      <>
        <p className="slots-para">Booking Slots:</p>
        <div className="scroll-width">
          <div className="scroll-app">
            <div className="dates-field">
              {date.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => dateOnClick(item)}
                  className={
                    bookedDate?.id === item.id
                      ? "active-dates-btn"
                      : "dates-btn"
                  }
                >
                  {item.dayName}
                  <br />
                  {item.month}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="scroll-width">
          <div className="scroll-app">
            <div className="dates-field">
              {hours.map((item) => (
                <button
                  type="button"
                  onClick={() => handleHourClick(item)}
                  key={item.hour}
                  className={
                    selectedHour?.hour === item.hour
                      ? "active-dates-btn"
                      : "dates-btn"
                  }
                >
                  {item.hour}:00
                </button>
              ))}
            </div>
          </div>
          <div className="simba">
            <button
              disabled={isLoading}
              onClick={appointmentApiCall}
              className="app-page-book"
            >
              {isLoading ? "Booking..." : "Request an Appointment"}
            </button>
          </div>
        </div>
      </>
    );
  };

  const renderSuccessView = () => {
    return (
      <>
        <div className="appoint-flex-div">
          <div className="appoint-img-div">
            <img className="app-doc-img" alt={data?.name} src={data?.image} />
          </div>
          <div className="w-100-div">
            <div className="app-doc-div">
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
              <p className="about-para-style">{data?.about}</p>
              <p className="app-fee">
                Appointment fee:
                <span style={{ color: "#1f2937" }}>${data?.fees}</span>
              </p>
            </div>
          </div>
        </div>
        {data?.availability ? (
          renderAvailable()
        ) : (
          <div className=" my-element">
            <h1 className="ulfa">
              The doctor is unavailable right now. Please try again later or
              leave a message, and we will get back to you as soon as possible.
            </h1>
          </div>
        )}
        <h1 style={{ textAlign: "center" }}>Related Doctors</h1>
        <p style={{ textAlign: "center" }}>
          Simply browse through our extensive list of trusted doctors.
        </p>
        <div>
          <ul className="related-doc-div">
            {relatedData.map((item: DoctorData) => (
              <li key={item.id} className="related-doc-li">
                <NavLink
                  style={{ textDecoration: "none" }}
                  to={`/appointment/${item.id}`}
                >
                  <div className="doc-img-div">
                    <img
                      className="related-doc-img"
                      alt={item.name}
                      src={item.doc_image_url}
                    />
                  </div>
                  <p className="available">
                    <GoDotFill /> Available
                  </p>
                  <p className="doc-name">{item.name}</p>
                  <p className="doc-spec">{item.speciality}</p>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  };

  const renderLoadingView = () => (
    <div
      style={{
        height: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      data-testid="loader"
    >
      <ThreeDots color="#0b69ff" height="50" width="50" />
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
          className="omega"
          type="button"
          disabled={apiStatus === apiStatusConstants.inProgress}
        >
          {apiStatus === apiStatusConstants.inProgress ? (
            <ThreeDots color="#fff" height="20" width="20" />
          ) : (
            "Retry"
          )}
        </button>
      </div>
    </>
  );

  const renderNxtWatchPage = () => {
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
      <Navbar />
      <div className="appoint-width">
        <div className="responsive-appoint-cont">
          {renderNxtWatchPage()}
          <Footer />
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Appointment;
