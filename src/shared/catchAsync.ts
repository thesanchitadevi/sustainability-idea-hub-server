import { NextFunction, Request, RequestHandler, Response } from "express";

// High-order function to catch async errors in Express middleware
// High-order function is a function that takes a function as an argument and returns a new function
const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

export default catchAsync;
