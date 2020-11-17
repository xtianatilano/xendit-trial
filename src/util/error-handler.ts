import { Response } from "express";

interface ErrorMessage {
    statusCode: number,
    message: string;
    errorCode: string;
}

export class ErrorHandler extends Error {
    statusCode: number;
    errorCode: string;
    message: string;

    constructor(statusCode, errorCode, message) {
      super();
      this.statusCode = statusCode;
      this.errorCode = errorCode;
      this.message = message;
    }
}

/**
 * @param err ErrorMessage
 * @param res Response
 */
export const handleError = (err: ErrorMessage, res: Response) => {
    const { statusCode, message, errorCode } = err;
    console.error(err);
    res.status(statusCode).json({
      status: "error",
      statusCode,
      errorCode,
      message
    });
};
