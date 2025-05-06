import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";

import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { PaymentService } from "./payment.service";
import { IAuthUser } from "../../interfaces/common";

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


// const validatePayment = catchAsync(async (req: Request, res: Response) => {
//     const result = await PaymentService.validatePayment(req.query);
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Payment validate successfully',
//         data: result,
//     });
// });

export const PaymentController = {
    initPayment,
    // validatePayment
}