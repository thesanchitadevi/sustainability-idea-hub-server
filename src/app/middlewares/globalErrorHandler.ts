import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let success = false;
  let message = err.message || "Something went wrong!";
  let errorDetails = err;

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Validation Error";
    errorDetails = err.message;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        statusCode = httpStatus.CONFLICT;
        message = "Duplicate entry violation";
        errorDetails = err.meta;
        break;
      case "P2003":
        statusCode = httpStatus.BAD_REQUEST;
        message = "Foreign key constraint failed";
        errorDetails = err.meta;
        break;
      case "P2025":
        statusCode = httpStatus.NOT_FOUND;
        message = "Record not found";
        errorDetails = err.meta;
        break;
      case "P2000":
        statusCode = httpStatus.BAD_REQUEST;
        message = "Input data is too long for column";
        errorDetails = err.meta;
        break;
      case "P2001":
        statusCode = httpStatus.NOT_FOUND;
        message = "Record does not exist";
        errorDetails = err.meta;
        break;
      case "P2004":
        statusCode = httpStatus.BAD_REQUEST;
        message = "Constraint failed on database";
        errorDetails = err.meta;
        break;
      case "P2005":
        statusCode = httpStatus.BAD_REQUEST;
        message = "Invalid field value";
        errorDetails = err.meta;
        break;
      case "P2006":
        statusCode = httpStatus.BAD_REQUEST;
        message = "Invalid field value for model";
        errorDetails = err.meta;
        break;
      case "P2007":
        statusCode = httpStatus.BAD_REQUEST;
        message = "Data validation error";
        errorDetails = err.meta;
        break;
      case "P2008":
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = "Failed to parse query";
        errorDetails = err.meta;
        break;
      case "P2009":
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = "Failed to validate query";
        errorDetails = err.meta;
        break;
      case "P2010":
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = "Raw query failed";
        errorDetails = err.meta;
        break;
      case "P2011":
        statusCode = httpStatus.BAD_REQUEST;
        message = "Null constraint violation";
        errorDetails = err.meta;
        break;
      case "P2012":
        statusCode = httpStatus.BAD_REQUEST;
        message = "Missing a required value";
        errorDetails = err.meta;
        break;
      case "P2013":
        statusCode = httpStatus.BAD_REQUEST;
        message = "Missing required argument";
        errorDetails = err.meta;
        break;
      case "P2014":
        statusCode = httpStatus.BAD_REQUEST;
        message = "Relation violation";
        errorDetails = err.meta;
        break;
      case "P2015":
        statusCode = httpStatus.NOT_FOUND;
        message = "Related record not found";
        errorDetails = err.meta;
        break;
      case "P2016":
        statusCode = httpStatus.BAD_REQUEST;
        message = "Query interpretation error";
        errorDetails = err.meta;
        break;
      case "P2017":
        statusCode = httpStatus.BAD_REQUEST;
        message = "Records for relation not connected";
        errorDetails = err.meta;
        break;
      case "P2018":
        statusCode = httpStatus.NOT_FOUND;
        message = "Required connected records not found";
        errorDetails = err.meta;
        break;
      case "P2019":
        statusCode = httpStatus.BAD_REQUEST;
        message = "Input error";
        errorDetails = err.meta;
        break;
      case "P2020":
        statusCode = httpStatus.BAD_REQUEST;
        message = "Value out of range";
        errorDetails = err.meta;
        break;
      case "P2021":
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = "Table does not exist";
        errorDetails = err.meta;
        break;
      case "P2022":
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = "Column does not exist";
        errorDetails = err.meta;
        break;
      case "P2023":
        statusCode = httpStatus.BAD_REQUEST;
        message = "Inconsistent column data";
        errorDetails = err.meta;
        break;
      case "P2024":
        statusCode = httpStatus.REQUEST_TIMEOUT;
        message = "Connection pool timeout";
        errorDetails = err.meta;
        break;
      default:
        statusCode = httpStatus.BAD_REQUEST;
        message = "Database error occurred";
        errorDetails = err.meta;
    }
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Unknown database error occurred";
    errorDetails = err.message;
  } else if (err instanceof Prisma.PrismaClientRustPanicError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = "Database engine crashed";
    errorDetails = err.message;
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = "Database connection error";
    errorDetails = err.message;
  }

  // Handle other types of errors (non-Prisma)
  if (
    !(
      err instanceof Prisma.PrismaClientKnownRequestError ||
      err instanceof Prisma.PrismaClientValidationError ||
      err instanceof Prisma.PrismaClientUnknownRequestError ||
      err instanceof Prisma.PrismaClientRustPanicError ||
      err instanceof Prisma.PrismaClientInitializationError
    )
  ) {
    if (err.name === "JsonWebTokenError") {
      statusCode = httpStatus.UNAUTHORIZED;
      message = "Invalid token";
    } else if (err.name === "TokenExpiredError") {
      statusCode = httpStatus.UNAUTHORIZED;
      message = "Token expired";
    } else if (err.name === "ValidationError") {
      statusCode = httpStatus.BAD_REQUEST;
      message = "Validation failed";
    } else if (err.code && err.code === "LIMIT_FILE_SIZE") {
      statusCode = httpStatus.BAD_REQUEST;
      message = "File too large";
    }
  }

  // Simplified error response for production
  const response = {
    success,
    message,
    errorDetails:
      process.env.NODE_ENV === "development" ? errorDetails : undefined,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  };

  res.status(statusCode).json(response);
};

export default globalErrorHandler;
