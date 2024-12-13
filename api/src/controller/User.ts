import { UUID } from "crypto";
import { db } from "../config/db";

import cloudinary from "cloudinary";
import { v2 as cloudinaryV2 } from "cloudinary";
import {
  cancelAppointment,
  getAppointments,
  getDoctors,
  getSpecialist,
  getuser,
  loginUser,
  registerUser,
  singleDoc,
  updateUserProfile,
  userAppointment,
} from "../service/User";
import { Request, response, Response } from "express";
import { AuthenticatedRequest } from "../middleware/userAuth";
require("dotenv").config();

export interface todoData {
  id: number;
  task: string;
  status: boolean;
}

interface params {
  id: string;
}

interface updateTodoData {
  id: number;
  task: string;
}

interface todoStatus {
  status: boolean;
  id: number;
}
export interface APPOINTMENTDATA {
  patientId: string;
  doctorId: UUID;
  doctorName: string;
  image: string;
  department: string;
  fees: number;
  appointmentDate: string;
  appointmentDay: string;
  appointmentHour: number;
  adrLine1: string;
  adrLine2: string;
  patientName: string;
  age: number;
  imageUrl: string;
  status: string;
}

export interface USERDATA {
  name: string;
  email: string;
  dob: string;
  phone?: number;
  address?: string;
  gender?: string;
  imageUrl?: string;
}

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const userController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const doctors = await getDoctors(db);

    if (!doctors || doctors.length === 0) {
      return res.status(404).send({
        message: "No doctors found.",
        data: [],
      });
    }

    return res.status(200).send({
      data: doctors,
      message: "Doctors data retrieved successfully",
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    console.error("Error in userController:", errorMessage);

    // Return a 500 status with error details
    return res.status(500).send({
      message: "Error retrieving doctors data",
      error: errorMessage,
    });
  }
};

export const specialityController = async (req: Request, res: Response) => {
  const speciality = req.params.speciality;

  try {
    console.log(`Fetching specialists for: ${speciality}`);

    const result = await getSpecialist(db, speciality);

    if (!result || result.length === 0) {
      return res.status(404).send({
        message: `No ${speciality} specialists found`,
      });
    }

    console.log("Specialists fetched successfully:", result);
    return res.status(200).send({
      data: result,
      message: `${speciality} doctors API call done`,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching specialists:", error.message);
      return res.status(500).send({
        message: `Error fetching ${speciality} doctors: ${error.message}`,
      });
    }

    console.error("Unknown error:", error);
    return res.status(500).send({
      message: "An unexpected error occurred while fetching specialists.",
    });
  }
};

export const singleDocController = async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log(id);

  try {
    const result = await singleDoc(db, id);
    if (!result) {
      return res.status(404).send({
        message: `Doctor with ID ${id} not found`,
      });
    }

    console.log(result);
    return res.status(200).send({
      data: result,
      message: "Doctor details fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching doctor data:", error);
    return res.status(500).send({
      message:
        "An error occurred while fetching doctor details. Please try again.",
    });
  }
};
export const getUserController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const user = req.user;

  const { id } = user as { id: string };

  try {
    const result = await getuser(db, id);

    if (!result || result.length === 0) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    console.log(result);
    return res.status(200).send({
      data: result,
      message: "User data fetched successfully",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching user data:", error.message);
      return res.status(500).send({
        message: error.message || "An error occurred while fetching user data.",
      });
    } else {
      console.error("Unknown error occurred:", error);
      return res.status(500).send({
        message: "An unknown error occurred while fetching user data.",
      });
    }
  }
};

export const registerController = async (req: Request, res: Response) => {
  const { userName, email, password } = req.body;
  console.log(userName, email, password);

  try {
    const imageUrl =
      "https://res.cloudinary.com/duzolgclw/image/upload/v1727961073/upload_area_ep8jrb.png";
    const result = await registerUser(userName, email, password, imageUrl, db);
    console.log(result);
    return res.status(200).send({
      message: result,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "User already exists") {
        return res.status(400).send({
          message: `user with ${email} already exists`,
        });
      } else {
        console.error("Unexpected error:", error);
        return res.status(500).send("Internal server error");
      }
    }
  }
};

export const loginController = async (req: Request, res: Response) => {
  const { userName, email, password } = req.body;
  console.log(userName, email, password);

  try {
    const result: any = await loginUser(email, password, db);
    console.log(result);
    return res.status(200).send({
      result,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "User not found") {
        return res.status(400).send({
          message: `User not found`,
        });
      }
      if (error.message === "Invalid password") {
        return res.status(400).send({
          message: `Invalid password`,
        });
      } else {
        console.error("Unexpected error:", error);
        return res.status(500).send("Internal server error");
      }
    }
  }
};

export const bookAppointmentController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const {
      doctorId,
      doctorName,
      image,
      department,
      fees,
      appointmentDate,
      appointmentDay,
      appointmentHour,
      adrLine1,
      adrLine2,
      patientName,
      age,
      imageUrl,
      status,
    } = req.body;
    console.log(doctorId);
    const user = req.user;
    const { id } = user as { id: string };
    console.log("patientId:", id);

    const appointment_details: APPOINTMENTDATA = {
      patientId: id,
      doctorId,
      doctorName,
      image,
      department,
      fees,
      appointmentDate,
      appointmentDay,
      appointmentHour,
      adrLine1,
      adrLine2,
      patientName,
      age: age || null,
      imageUrl,
      status,
    };
    console.log(age);

    const result = await userAppointment(appointment_details);
    return res.status(200).send({
      success: true,
      result,
    });
  } catch (error) {
    const errorMessage =
      (error as Error).message ||
      "An error occurred while booking the appointment.";
    console.error(`Error during booking appointment: ${errorMessage}`);
    return res.status(400).send({
      success: false,
      message:
        errorMessage || "An error occurred while booking the appointment.",
    });
  }
};

export const getAppController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const user = req.user;

    const { id } = user as { id: string };

    const result = await getAppointments(db, id);

    if (!result || result.length === 0) {
      return res.status(404).json({
        message: "No appointments found",
      });
    }

    return res.status(200).json({
      data: result,
      message: "Appointments retrieved successfully",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching appointments:", error.message);
      return res.status(500).json({
        message: "Unable to fetch appointments",
        error: error.message,
      });
    } else {
      console.error("Unknown error:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: "An unexpected error occurred",
      });
    }
  }
};

export const cancelBookingController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  console.log(status);

  try {
    const result = await cancelAppointment(id, status);
    return res
      .status(200)
      .json({ message: "status updated successfully", result });
  } catch (error) {
    console.error("Error updating availability:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserProfileController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      gender,
      birthday: dob,
      prevImageUrl,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required fields.",
      });
    }

    const profileImage = req.file;
    let fileUrl = null;

    if (profileImage) {
      try {
        const uploadResponse = await cloudinaryV2.uploader.upload(
          profileImage.path
        );
        fileUrl = uploadResponse.secure_url;
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload profile image.",
        });
      }
    }

    const user = req.user;
    const { id } = user as { id: string };

    const userData: USERDATA = {
      name,
      email,
      imageUrl: fileUrl || prevImageUrl,
      phone: phone || null,
      gender: gender || null,
      dob: dob || null,
      address: address || null,
    };

    const result = await updateUserProfile(userData, id, db);

    return res.status(200).json({
      success: true,
      message: result || "User profile updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};
