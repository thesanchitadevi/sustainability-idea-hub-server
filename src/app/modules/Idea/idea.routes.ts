import express, { NextFunction, Request, Response } from "express";
import auth from "../../middlewares/auth";

import { fileUploader } from "../../../helpers/fileUploader";
import { IdeaController } from "./idea.controller";
import { IdeaValidation } from "./idea.validation";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "../../../../generated/prisma";

const router = express.Router();

// router.post(
//   "/",
//   auth(UserRole.MEMBERS),
//   fileUploader.upload.array("files", 5), // Handle multiple files
//   (req: Request, res: Response, next: NextFunction) => {
//     // Parse the JSON data from form-data
//     const data = JSON.parse(req.body.data);
//     // Validate the data
//     const validatedData = IdeaValidation.createIdeaSchema.parse(data);
//     // Assign the validated data to req.body
//     req.body = validatedData;
//     return IdeaController.createIdea(req, res, next);
//   }
// );

router.post(
  "/",
  auth(UserRole.MEMBERS),
  fileUploader.upload.array("files", 5),
  (req: Request, res: Response, next: NextFunction) => {
    const data = JSON.parse(req.body.data);
    const validatedData = IdeaValidation.createIdeaSchema.parse(data);
    req.body = validatedData;
    return IdeaController.createIdea(req, res, next);
  }
);


router.get("/", IdeaController.getAllIdeas);
router.get(
  "/:id",
  // auth(UserRole.MEMBERS, UserRole.ADMIN),
  IdeaController.getIdeaById
);

router.patch(
  "/:id",
  auth(UserRole.MEMBERS),
  validateRequest(IdeaValidation.updateIdeaSchema),
  IdeaController.updateIdea
);

router.delete(
  "/:id",
  auth(UserRole.MEMBERS, UserRole.ADMIN),
  IdeaController.deleteIdea
);

router.patch(
  '/:id/status',
  auth(UserRole.ADMIN),
  IdeaController.updateStatus
);

router.post(
  '/:id/submit',
  auth(UserRole.MEMBERS),
  IdeaController.submitForReview
);

export const IdeaRoutes = router;
