import { Request, Response } from "express";
import { UserServices } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import Pick from "../../../shared/pick";
import { userFilterableFields } from "./user.contants";
import { IAuthUser } from "../../interfaces/common";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createUser(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Created successfuly!",
    data: result,
  });
});

const gettAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = Pick(req.query, userFilterableFields);
  const options = Pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await UserServices.getAllUsersFromDB(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

// const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const result = await UserServices.changeProfileStatus(id, req.body);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Profile status changed successfully!",
//     data: result,
//   });
// });

// const getMyProfile = catchAsync(
//   async (req: Request & { user?: IAuthUser }, res: Response) => {
//     const user = req.user;
//     const result = await UserServices.getMyProfile(user as IAuthUser);

//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "User profile retrieved successfully!",
//       data: result,
//     });
//   }
// );

// const updateMyProfile = catchAsync(
//   async (req: Request & { user?: IAuthUser }, res: Response) => {
//     const user = req.user;
//     const result = await UserServices.updateMyProfile(user as IAuthUser, req);

//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "My profile updated successfully!",
//       data: result,
//     });
//   }
// );

export const UserControllers = {
  createUser,
  gettAllUsers,
  // changeProfileStatus,
  // getMyProfile,
  // updateMyProfile,
};
