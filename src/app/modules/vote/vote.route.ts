import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { getVoteController, voteController } from "./vote.controller";

export const VoteRoutes = Router();

VoteRoutes.post("/:ideaId", auth(UserRole.MEMBERS), voteController);
VoteRoutes.get("/:ideaId", auth(UserRole.MEMBERS), getVoteController);
