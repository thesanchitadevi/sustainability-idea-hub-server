import express from "express";
import { AdminControllers } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AdminValidationSchemas } from "./admin.validations";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.ADMIN),
  AdminControllers.getAllAdmin
);

router.get(
  "/:id",
  auth(UserRole.ADMIN),
  AdminControllers.getAdminById
);

router.patch(
  "/:id",
  auth(UserRole.ADMIN),
  validateRequest(AdminValidationSchemas.updateValidation),
  AdminControllers.updateAdmin
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  AdminControllers.deleteAdmin
);

router.delete(
  "/soft-delete/:id",
  auth(UserRole.ADMIN),
  AdminControllers.softDeleteAdmin
);

export const AdminRouter = router;
