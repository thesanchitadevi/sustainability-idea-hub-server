import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import {
  createCommnetController,
  deleteCommentController,
  getCommentController,
} from "./comment.controller";

export const CommentRouter = Router();

CommentRouter.post("/create", auth(UserRole.MEMBERS), createCommnetController);
CommentRouter.get("/:ideaId", auth(UserRole.MEMBERS), getCommentController);
CommentRouter.delete(
  "/:commentId",
  auth(UserRole.ADMIN),
  deleteCommentController
);
