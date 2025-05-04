import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { IAuthUser } from "../../interfaces/common";
import { IdeaServices } from "./idea.service";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { IFile } from "../../interfaces/file";
import { AppError } from "../../errors/AppError";

// Create a new idea
const createIdea = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    // Check if user is authenticated and userId exists
    if (!req.user || !req.user.userId) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "User not authenticated or userId not found"
      );
    }

    const payload = req.body;
    const files = req.files as IFile[];

    const result = await IdeaServices.createIdea(
      req.user.userId,
      payload,
      files
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Idea created successfully",
      data: result,
    });
  }
);

export const IdeaController = {
  createIdea,
};
