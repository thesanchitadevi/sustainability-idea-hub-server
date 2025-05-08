import express from "express";
import { AuthControllers } from "./auth.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma";


const router = express.Router();

router.post("/login", AuthControllers.loginUser);
router.post("/refresh-token", AuthControllers.refreshToken);
router.post(
  "/change-password",
  auth(UserRole.ADMIN),
  AuthControllers.changePassword
);
router.post(
  "/forgot-password",
  // auth(UserRole.DOCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AuthControllers.forgotPassword
);
router.post(
  "/reset-password",
  // auth(UserRole.DOCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AuthControllers.resetPassword
);

export const AuthRouter = router;
