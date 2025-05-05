import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        // add other user properties as needed
      };
    }
  }
}
