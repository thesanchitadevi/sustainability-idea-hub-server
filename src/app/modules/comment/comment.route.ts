import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import {
  createCommnetController,
  deleteCommentController,
  getCommentController,
} from "./comment.controller";
import { createCommentSchema } from "./comment.validation";

export const CommentRouter = Router();

CommentRouter.post(
  "/create",
  auth(UserRole.MEMBERS),
  validateRequest(createCommentSchema),
  createCommnetController
);
CommentRouter.get("/:ideaId", auth(UserRole.MEMBERS), getCommentController);
CommentRouter.delete(
  "/:commentId",
  auth(UserRole.ADMIN),
  deleteCommentController
);
