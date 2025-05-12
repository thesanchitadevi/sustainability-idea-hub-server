import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AppError } from "../../errors/AppError";
import { getVoteService, handleVoteService } from "./vote.service";

export const voteController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { ideaId } = req.params;
    const { voteType } = req.body;
    if (!userId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
    }
    // Call the service to handle the vote
    const result = await handleVoteService({ userId, ideaId, voteType });

    // Send the response
    res.status(200).json({
      status: "success",
      message: result.message,
      data: result.data || null,
    });
  }
);

export const getVoteController = catchAsync(
  async (req: Request, res: Response) => {
    // const userId = req.user?.userId;
    const { ideaId } = req.params;
    // if (!userId) {
    //   throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
    // }
    // Call the service to handle the vote
    const result = await getVoteService(ideaId);

    // Send the response
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: result.message,
      data: result.data,
    });
  }
);
