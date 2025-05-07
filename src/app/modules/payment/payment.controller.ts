import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";

import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { PaymentService } from "./payment.service";
import { IAuthUser } from "../../interfaces/common";
import { AppError } from "../../errors/AppError";
import config from "../../../config";

const initPayment = catchAsync(async (req: Request & {user? : IAuthUser}, res: Response) => {
    const { ideaId } = req.params;
    const user = req.user;
    const result = await PaymentService.initPayment(ideaId, user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment initiate successfully',
        data: result,
    });
});


const validatePayment = catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentService.validatePayment(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment validate successfully',
        data: result,
    });
});

const successPayment = catchAsync(async (req, res) => {
    const successInfo = req.body; // this body content is provied by ssl after payment success
    // console.log('sueecess = ', successInfo);
    const userId = successInfo.tran_id.split('.')[0];
    const ideaId = successInfo.tran_id.split('.')[1];

    // console.log(userId, " === ", ideaId)
  
    if (successInfo?.status !== 'VALID') {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid Payment');
    }
  
    await PaymentService.successPayment(userId, ideaId, successInfo.amount)

    // sendResponse(res, {
    //     statusCode: httpStatus.OK,
    //     success: true,
    //     message: 'Payment  successfull',
    //     data: null,
    // });
    
    res.redirect(`${config.ssl.front_end_url}/success`)
    
  });

  const failedPayment = catchAsync(async (req, res) => {

    res.redirect(`${config.ssl.front_end_url}/fail`)
    
   
    // sendResponse(res, {
    //   statusCode: httpStatus.BAD_GATEWAY,
    //   success: false,
    //   message: `Payment Failed`,
    //   data: {},
    // });
  });
  const canceledPayment = catchAsync(async (req, res) => {
    res.redirect(`${config.ssl.front_end_url}/cancel`)
   
    // sendResponse(res, {
    //   statusCode: httpStatus.BAD_GATEWAY,
    //   success: false,
    //   message: `Payment Canceled`,
    //   data: {},
    // });
  });
  const alreadyPaidByUser = catchAsync(async (req : Request & {user?: IAuthUser}, res) => {
    const {ideaId} = req.params;
    const user = req.user;
    if(!user) {
        throw new AppError(httpStatus.BAD_REQUEST,'User not found!')
    }
    const result = await PaymentService.paidIdeaInfo(ideaId, user);
   
   
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Paid idea fetched Successfully`,
      data: result,
    });
  });

export const PaymentController = {
    initPayment,
    validatePayment,
    successPayment,
    failedPayment,
    canceledPayment,
    alreadyPaidByUser
}