import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { IAuthUser } from "../../interfaces/common";
import { IdeaServices } from "./idea.service";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { IFile } from "../../interfaces/file";
import { AppError } from "../../errors/AppError";
import Pick from "../../../shared/pick";
import { ideaFilterableFields } from "./idea.constant";
import { UserRole } from "@prisma/client";

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

// Get all ideas with pagination and filtering
const getAllIdeas = catchAsync(async (req: Request, res: Response) => {
  const filters = Pick(req.query, ideaFilterableFields);
  const options = Pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await IdeaServices.getAllIdeas(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Ideas retrieved successfully",
    data: result,
  });
});

// Get a single idea by ID with role-based access control
const getIdeaById = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const { id } = req.params;

    // Get user role and ID from request
    const userRole = req.user?.role as UserRole;
    const userId = req.user?.userId;
    const result = await IdeaServices.getIdeaById(id, userRole, userId);

    // Check if the idea exists
    if (!result) {
      throw new AppError(httpStatus.NOT_FOUND, "Idea not found");
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Idea retrieved successfully",
      data: result,
    });
  }
);

// Update an idea by ID
const updateIdea = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const { id } = req.params;
    const userRole = req.user?.role as UserRole;
    const userId = req.user?.userId;

    const result = await IdeaServices.updateIdea(
      id,
      req.body,
      userRole,
      userId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Idea updated successfully",
      data: result,
    });
  }
);

// Delete an idea
const deleteIdea = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const { id } = req.params;
    const userRole = req.user?.role as UserRole;
    const userId = req.user?.userId;

    await IdeaServices.deleteIdea(id, userRole, userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Idea deleted successfully",
      data: null,
    });
  }
);

// Update idea status
const updateStatus = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const { id } = req.params;
    const userRole = req.user?.role as UserRole;

    const result = await IdeaServices.updateIdeaStatusByAdmin(
      id,
      req.body,
      userRole
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Idea status updated successfully",
      data: result,
    });
  }
);

const submitForReview = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required");
    }

    const result = await IdeaServices.submitIdeaForReview(id, userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Idea submitted for review successfully",
      data: result,
    });
  }
);

export const IdeaController = {
  createIdea,
  getAllIdeas,
  getIdeaById,
  updateIdea,
  deleteIdea,
  updateStatus,
  submitForReview,
};
