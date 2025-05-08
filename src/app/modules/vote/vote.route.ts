
import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { getVoteController, voteController } from "./vote.controller";
import { voteSchema } from "./vote.validation";
import { UserRole } from "../../../../generated/prisma";

export const VoteRoutes = Router();

VoteRoutes.post(
  "/:ideaId",
  auth(UserRole.MEMBERS),
  validateRequest(voteSchema),
  voteController
);
VoteRoutes.get("/:ideaId", auth(UserRole.MEMBERS), getVoteController);
