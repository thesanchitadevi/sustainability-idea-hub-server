import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AppError } from "../../errors/AppError";
import {
  createCommentService,
  deleteCommentService,
  getCommentService,
} from "./comment.service";

export const createCommnetController = catchAsync(
  async (req: Request, res: Response) => {
    const { ideaId, parentId, comment } = req.body;

    if (!req.user) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
    }
    const { userId } = req.user;
    const result = await createCommentService({
      userId,
      ideaId,
      parentId,
      comment,
    });
    // Send the response
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Comment posted successfully",
      data: result,
    });
  }
);

export const getCommentController = catchAsync(
  async (req: Request, res: Response) => {
    const { ideaId } = req.params;
    if (!ideaId) {
      throw new AppError(httpStatus.BAD_REQUEST, "Idea ID is required");
    }
    const result = await getCommentService(ideaId);
    // Send the response
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Comments fetched successfully",
      data: result,
    });
  }
);

// delete comment
export const deleteCommentController = catchAsync(
  async (req: Request, res: Response) => {
    const { commentId } = req.params;
    if (!commentId) {
      throw new AppError(httpStatus.BAD_REQUEST, "Comment ID is required");
    }
    const result = await deleteCommentService(commentId);
    // Send the response
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Comment deleted successfully",
      data: result,
    });
  }
);
