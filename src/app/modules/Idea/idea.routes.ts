import express, { NextFunction, Request, Response } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpers/fileUploader";
import { IdeaController } from "./idea.controller";
import { IdeaValidation } from "./idea.validation";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.MEMBERS),
  fileUploader.upload.array("files", 5), // Handle multiple files
  (req: Request, res: Response, next: NextFunction) => {
    // Parse the JSON data from form-data
    const data = JSON.parse(req.body.data);
    // Validate the data
    const validatedData = IdeaValidation.createIdeaSchema.parse(data);
    // Assign the validated data to req.body
    req.body = validatedData;
    return IdeaController.createIdea(req, res, next);
  }
);

router.get("/", IdeaController.getAllIdeas);

export const IdeaRoutes = router;
