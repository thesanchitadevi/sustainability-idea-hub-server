import express from "express";
import { AdminControllers } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";

import auth from "../../middlewares/auth";

import { AdminValidationSchemas } from "./admin.validations";
import { UserRole } from "../../../../generated/prisma";

const router = express.Router();

router.patch(
  "/idea/:id/rejectIdea",
  auth(UserRole.ADMIN),
  validateRequest(AdminValidationSchemas.rejectionFeedbackValidation),
  AdminControllers.rejectionIdea
);

// reject idea with rejection feedback

export const AdminRouter = router;
