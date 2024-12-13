import { Router } from "express";
import userRouter from "./User";
import adminRouter from "./Admin";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello, TypeScript with Express!");
});

router.use("/api/user", userRouter);
router.use("/api/admin", adminRouter);

export default router;
