import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AppError } from "../../errors/AppError";
import { createCommentService } from "./comment.service";

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
