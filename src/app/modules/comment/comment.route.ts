import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import {
  createCommnetController,
  deleteCommentController,
  getCommentController,
} from "./comment.controller";
import { createCommentSchema } from "./comment.validation";
import { UserRole } from "../../../../generated/prisma";

export const CommentRouter = Router();

CommentRouter.post(
  "/create",
  auth(UserRole.MEMBERS),
  validateRequest(createCommentSchema),
  createCommnetController
);
CommentRouter.get("/:ideaId", getCommentController);
CommentRouter.delete(
  "/:commentId",
  auth(UserRole.ADMIN),
  deleteCommentController
);
