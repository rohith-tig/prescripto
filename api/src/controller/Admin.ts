import { db } from "../config/db";
import {
  adminSingleDoc,
  completeAppointment,
  confirmAppointment,
  createDoctor,
  deleteApppointment,
  getAdmin,
  getAdminAppointmentList,
  getDoctorAppointmentList,
  getDoctorDetailsAndAppointments,
  getNewDoctorAppointmentList,
  loginAdmin,
  loginDoctor,
  registerAdmin,
  singleAdmin,
  singleDoc,
  updateDoctorEarnings,
  updateDoctorProfile,
} from "../service/Admin";
import cloudinary from "cloudinary";
import { v2 as cloudinaryV2 } from "cloudinary";
import { Request, Response } from "express";
import { upload } from "../middleware/multer";
import { updateDoctorAvailability } from "../service/Admin";
require("dotenv").config();
import { AuthenticatedDocRequest } from "../middleware/docAuth";
import { AuthenticatedAdminRequest } from "../middleware/adminAuth";

export interface DoctorData {
  name: string;
  email: string;
  password: string;
  imageUrl?: string;
  speciality: string;
  degree: string;
  experience: string;
  about: string;
  fees: number;
  address1: string;
  address2: string; // Optional
}

export interface DOCDATA {
  about: string;
  fees: number;
  adrLine1: string;
  adrLine2: string;
  imageUrl: string;
}

export const adminController = async (req: Request, res: Response) => {
  const dbname = db;
  const result = await getAdmin(db);
  console.log(result);
  return res.status(200).send({
    data: result,
    message: "Basic Api Call Done",
  });
};

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const singleDocController = async (
  req: AuthenticatedDocRequest,
  res: Response
) => {
  try {
    const doctor = req.docInfo;
    const { id } = doctor as { id: string };
    console.log(doctor);

    if (!doctor || !id) {
      return res.status(400).send({
        message: "Doctor information is missing or invalid.",
      });
    }

    const result = await singleDoc(db, id);

    console.log("Doctor Details Fetched:", result);

    return res.status(200).send({
      data: result,
      message: "Doctor details fetched successfully.",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in singleDocController:", error.message);

      const statusCode = error.message.includes("not found") ? 404 : 500;
      return res.status(statusCode).send({
        message: error.message || "An unexpected error occurred.",
      });
    }

    console.error("Unknown error:", error);
    return res.status(500).send({
      message: "An unexpected error occurred while processing your request.",
    });
  }
};

export const singleAdminController = async (
  req: AuthenticatedAdminRequest,
  res: Response
) => {
  try {
    const Admin = req.adminInfo;
    const { id } = Admin as { id: string };
    console.log(Admin);

    if (!Admin || !id) {
      return res.status(400).send({
        message: "Admin information is missing or invalid.",
      });
    }

    const result = await singleAdmin(db, id);

    console.log("Admin Details Fetched:", result);

    return res.status(200).send({
      data: result,
      message: "Admin details fetched successfully.",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in singleAdminController:", error.message);

      const statusCode = error.message.includes("not found") ? 404 : 500;
      return res.status(statusCode).send({
        message: error.message || "An unexpected error occurred.",
      });
    }

    console.error("Unknown error:", error);
    return res.status(500).send({
      message: "An unexpected error occurred while processing your request.",
    });
  }
};

export const adminDocController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).send({
        message: "Doctor information is missing or invalid.",
      });
    }

    const result = await adminSingleDoc(db, id);

    console.log("Doctor Details Fetched:", result);

    return res.status(200).send({
      data: result,
      message: "Doctor details fetched successfully.",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in singleDocController:", error.message);

      const statusCode = error.message.includes("not found") ? 404 : 500;
      return res.status(statusCode).send({
        message: error.message || "An unexpected error occurred.",
      });
    }

    console.error("Unknown error:", error);
    return res.status(500).send({
      message: "An unexpected error occurred while processing your request.",
    });
  }
};

export const addDoctorController = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      experience,
      fees,
      degree,
      speciality,
      address1,
      address2,
      about,
    } = req.body;

    const file = req.file;
    console.log(file);

    let fileUrl = null;
    if (file) {
      const uploadResponse = await cloudinaryV2.uploader.upload(file.path);
      fileUrl = uploadResponse.secure_url;
    }

    const doctorData: DoctorData = {
      name,
      email,
      password,
      experience,
      fees,
      degree,
      speciality,
      address1,
      address2,
      about,
      imageUrl: fileUrl || undefined,
    };

    const result = await createDoctor(doctorData);
    return res.status(201).json({
      success: true,
      message: "Doctor added successfully",
      doctor: result,
    });
  } catch (error) {
    console.error("Error adding doctor:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to add doctor" });
  }
};

export const updateDoctorAvailabilityController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const { available } = req.body;

  try {
    const result = await updateDoctorAvailability(id, available);
    return res
      .status(200)
      .json({ message: "Availability updated successfully", result });
  } catch (error) {
    console.error("Error updating availability:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const doctorLoginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const result = await loginDoctor(email, password, db);
    console.log(result);
    return res.status(200).send({
      result,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Doctor not found") {
        return res.status(400).send({
          message: `Doctor not found`,
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

export const adminLoginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const result = await loginAdmin(email, password, db);
    console.log(result);
    return res.status(200).send({
      result,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === `Admin with email ${email} does not exists`) {
        return res.status(400).send({
          message: `Admin with email ${email} does not exists`,
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

export const newDoctorAppointmentList = async (
  req: AuthenticatedDocRequest,
  res: Response
) => {
  try {
    const Doctor = req.docInfo;
    if (!Doctor) {
      return res.status(401).json({ message: "Doctor information is missing" });
    }

    const { id } = Doctor as { id: string };

    const result = await getNewDoctorAppointmentList(db, id);

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

export const getDoctorAppointmentController = async (
  req: AuthenticatedDocRequest,
  res: Response
) => {
  try {
    const Doctor = req.docInfo;

    const { id } = Doctor as { id: string };

    const result = await getDoctorAppointmentList(db, id);

    if (result.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No appointments available",
        data: [],
      });
    }

    return res.status(200).json({
      data: result,
      message: "Appointments retrieved successfully",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        "Error fetching appointments:",
        error.stack || error.message
      );
      return res.status(500).json({
        success: false,
        message: "Unable to fetch appointments",
        error: error.message,
      });
    } else {
      console.error("Unknown error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: "An unexpected error occurred",
      });
    }
  }
};

export const getDoctorProfileAndAppointmentsController = async (
  req: AuthenticatedDocRequest,
  res: Response
) => {
  try {
    const Doctor = req.docInfo;

    const { id } = Doctor as { id: string };
    const data = await getDoctorDetailsAndAppointments(db, id);

    return res.status(200).send({
      data,
      message: "Doctor details and appointments fetched successfully",
    });
  } catch (error: unknown) {
    console.error("Error fetching doctor profile and appointments:", error);
    return res.status(500).send({
      message:
        "An error occurred while fetching doctor details and appointments",
    });
  }
};

export const getAdminAppointmentListController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getAdminAppointmentList(db);

    return res.status(200).json({
      success: true,
      message: "Appointments retrieved successfully",
      data: result,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        "Error fetching appointments:",
        error.stack || error.message
      );
      return res.status(500).json({
        success: false,
        message: "Unable to fetch appointments",
        error: error.message,
      });
    } else {
      console.error("Unknown error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: "An unexpected error occurred",
      });
    }
  }
};

export const confirmBookingController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { statusText } = req.body;
  const { patientName } = req.body;
  const { doctorId } = req.body;
  const { fees } = req.body;
  console.log("status", statusText);

  try {
    const result = await confirmAppointment(
      id,
      statusText,
      patientName,
      doctorId,
      fees
    );
    return res.status(200).json({
      message: `${patientName}'s Appointment ${statusText} successfully`,
      result,
    });
  } catch (error: unknown) {
    console.error("Error updating availability:", error);
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message || "An unexpected error occurred",
      });
    }
  }
};

export const deleteApppointmentController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const { patientName } = req.body;
  try {
    const result = await deleteApppointment(id);
    return res.status(200).json({
      message: `${patientName}'s Appointment Deleted successfully`,
      result,
    });
  } catch (error: unknown) {
    console.error("Error deleting Appointment:", error);
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message || "An unexpected error occurred",
      });
    }
  }
};

export const completeBookingController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log("status", status);

  try {
    const result = await completeAppointment(id, status);
    return res
      .status(200)
      .json({ message: "status updated successfully", result });
  } catch (error) {
    console.error("Error updating availability:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateEarningsController = async (
  req: AuthenticatedDocRequest,
  res: Response
) => {
  try {
    const Doctor = req.docInfo;
    console.log(Doctor);

    const { id } = Doctor as { id: string };

    const result = await updateDoctorEarnings(db, id, req.body.earnings);

    return res.status(200).json({
      message: "earnings Updated",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error update Earnings:", error.message);
      return res.status(500).json({
        message: "Unable to update Earnings",
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

export const registerAdminController = async (req: Request, res: Response) => {
  const { userName, email, password } = req.body;
  console.log(userName, email, password);

  try {
    const result = await registerAdmin(userName, email, password, db);
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

export const updateDoctorProfileController = async (
  req: Request,
  res: Response
) => {
  try {
    const { about, fees, adrLine1, adrLine2, prevImageUrl, availability } =
      req.body;
    const available = availability === "true" ? true : false;
    const Image = req.file;
    let fileUrl = null;

    if (Image) {
      try {
        const uploadResponse = await cloudinaryV2.uploader.upload(Image.path);
        fileUrl = uploadResponse.secure_url;
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload profile image.",
        });
      }
    }

    const { id } = req.params;

    const DoctorData: DOCDATA = {
      about,
      fees,
      imageUrl: fileUrl || prevImageUrl,
      adrLine1,
      adrLine2,
    };

    const result = await updateDoctorProfile(DoctorData, id, db, available);

    return res.status(200).json({
      success: true,
      message: result || "Doctor profile updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

export const updateDoctorProfileController1 = async (
  req: AuthenticatedDocRequest,
  res: Response
) => {
  try {
    const { about, fees, adrLine1, adrLine2, prevImageUrl, availability } =
      req.body;
    const available = availability === "true" ? true : false;

    const DoctorImage = req.file;
    let fileUrl = null;

    if (DoctorImage) {
      try {
        const uploadResponse = await cloudinaryV2.uploader.upload(
          DoctorImage.path
        );
        fileUrl = uploadResponse.secure_url;
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload profile image.",
        });
      }
    }

    const Doctor = req.docInfo;
    const { id } = Doctor as { id: string };

    const DoctorData: DOCDATA = {
      about,
      fees,
      imageUrl: fileUrl || prevImageUrl,
      adrLine1,
      adrLine2,
    };

    const result = await updateDoctorProfile(DoctorData, id, db, available);

    return res.status(200).json({
      success: true,
      message: result || "Doctor profile updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};
