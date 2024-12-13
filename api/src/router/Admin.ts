import { Router } from "express";
import {
  addDoctorController,
  updateDoctorAvailabilityController,
  adminController,
  doctorLoginController,
  newDoctorAppointmentList,
  confirmBookingController,
  singleDocController,
  getDoctorAppointmentController,
  updateEarningsController,
  completeBookingController,
  adminDocController,
  registerAdminController,
  adminLoginController,
  getAdminAppointmentListController,
  updateDoctorProfileController,
  getDoctorProfileAndAppointmentsController,
  deleteApppointmentController,
  updateDoctorProfileController1,
  singleAdminController,
} from "../controller/Admin";
import { upload } from "../middleware/multer";
import { verifyDocToken } from "../middleware/docAuth";
import { verifyAdminToken } from "../middleware/adminAuth";

const adminRouter = Router();

adminRouter.get("/admin/", adminController);

adminRouter.post("/add-doctor/", upload.single("file"), addDoctorController);
adminRouter.put(
  "/doctors/:id/availability",
  updateDoctorAvailabilityController
);

adminRouter.post("/doctor/login", doctorLoginController);
adminRouter.get("/doctor-profile", verifyDocToken, singleDocController);
adminRouter.get("/doctor/doctorp/:id", adminDocController);
adminRouter.post("/admin/login", adminLoginController);
adminRouter.get(
  "/doctor/appointments",
  verifyDocToken,
  newDoctorAppointmentList
);
adminRouter.get(
  "/doctor/appointmentList",
  verifyDocToken,
  getDoctorAppointmentController
);
adminRouter.get(
  "/doctor-dashboard",
  verifyDocToken,
  getDoctorProfileAndAppointmentsController
);
adminRouter.get(
  "/admin/appointmentList",
  verifyAdminToken,
  getAdminAppointmentListController
);
adminRouter.put(
  "/doctor/updateEarnings",
  verifyDocToken,
  updateEarningsController
);
adminRouter.put("/patient/:id/status", confirmBookingController);
adminRouter.put("/patient/:id/completedStatus", completeBookingController);
adminRouter.post("/registerAdmin", registerAdminController);
adminRouter.put(
  "/admin/update-profile/:id",
  verifyAdminToken,
  upload.single("Image"),

  updateDoctorProfileController
);
adminRouter.put(
  "/doctor/update-profile/",
  verifyDocToken,
  upload.single("DoctorImage"),
  updateDoctorProfileController1
);
adminRouter.delete("/delete-appointment/:id", deleteApppointmentController);
adminRouter.get("/admin-details", verifyAdminToken, singleAdminController);

export default adminRouter;
