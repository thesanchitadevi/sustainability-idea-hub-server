import express, { NextFunction, Request, Response } from "express";
import { UserControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpers/fileUploader";
import { UserValidationSchema } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  UserControllers.gettAllUsers
);

router.get(
  "/me",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  UserControllers.getMyProfile
);

router.post(
  "/create-admin",

  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    // Parse the JSON data first
    const data = JSON.parse(req.body.data);
    // Validate the data
    const validatedData = UserValidationSchema.createAdmin.parse(data);
    // Assign the validated data to req.body
    req.body = validatedData;
    return UserControllers.createAdmin(req, res, next);
  }
);

router.patch(
  "/:id/status",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(UserValidationSchema.updateStatus),
  UserControllers.changeProfileStatus
);

export const UserRouter = router;
