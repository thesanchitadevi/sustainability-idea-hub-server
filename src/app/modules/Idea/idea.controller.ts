import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { IAuthUser } from "../../interfaces/common";
import { IdeaServices } from "./idea.service";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { IFile } from "../../interfaces/file";

// Create a new idea
const createIdea = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    console.log(req.body, "body");
    console.log(req.user, "user");
    console.log(req.files, "files");

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
