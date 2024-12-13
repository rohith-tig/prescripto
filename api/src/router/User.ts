import { Router } from "express";
import {
  bookAppointmentController,
  cancelBookingController,
  getAppController,
  getUserController,
  loginController,
  registerController,
  singleDocController,
  specialityController,
  updateUserProfileController,
  userController,
} from "../controller/User";
import { verifyToken } from "../middleware/userAuth";
import { upload } from "../middleware/multer";

const userRouter = Router();
userRouter.get("/doctors/", userController);
userRouter.post("/register", registerController);
userRouter.post("/login", loginController);
userRouter.get("/doctors/:speciality/", specialityController);
userRouter.get("/appointment/:id/", singleDocController);
userRouter.post("/book-appointment", verifyToken, bookAppointmentController);
userRouter.get("/get-appointments", verifyToken, getAppController);
userRouter.get("/user-info", verifyToken, getUserController);
userRouter.put("/cancel-appointment/:id", cancelBookingController);
userRouter.put(
  "/update-profile/",
  verifyToken,
  upload.single("profileImage"),
  updateUserProfileController
);
export default userRouter;
