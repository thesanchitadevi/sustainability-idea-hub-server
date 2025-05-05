import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { createCommnetController } from "./comment.controller";

export const CommentRouter = Router();

CommentRouter.post("/create", auth(UserRole.MEMBERS), createCommnetController);
