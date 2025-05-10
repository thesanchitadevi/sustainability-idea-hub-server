import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { AdminServices } from "./admin.service";
import { adminFilterableFields } from "./admin.contant";
import Pick from "../../../shared/pick";
import { Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import { ideaFilterableFields } from "../Idea/idea.constant";
import { IdeaServices } from "../Idea/idea.service";
import { AuthServices } from "../Auth/auth.service";

const rejectionIdea = catchAsync(async (req: Request, res: Response) => {

  const {id} = req.params;
  
  const result = await AdminServices.rejectionIdea(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin reject an idea!",
    data: result
  });
});

const getAllIdeasLForAdmin = catchAsync(async (req: Request, res: Response) => {
  const filters = Pick(req.query, ideaFilterableFields);
  const options = Pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await AdminServices.getAllIdeasForAdmin(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Ideas retrieved successfully",
    data: result,
  });
});




export const AdminControllers = {
  rejectionIdea,
  getAllIdeasLForAdmin
 
};
