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
  auth(UserRole.ADMIN),
  UserControllers.gettAllUsers
);

// router.get(
//   "/me",
//   auth(UserRole.ADMIN),
//   UserControllers.getMyProfile
// );

router.post(
  "/create-user",

  // auth(UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    // Parse the JSON data first
    const data = JSON.parse(req.body.data);
    // Validate the data
    const validatedData = UserValidationSchema.createAdmin.parse(data);
    // Assign the validated data to req.body
    req.body = validatedData;
    return UserControllers.createUser(req, res, next);
  }
);



router.patch(
  "/:id/status",
  auth( UserRole.ADMIN),
  validateRequest(UserValidationSchema.updateStatus),
  UserControllers.changeProfileStatus
);
router.patch(
  "/:id/role",
  auth( UserRole.ADMIN),
  validateRequest(UserValidationSchema.updateRole),
  UserControllers.changeProfileRole
);

export const UserRouter = router;
