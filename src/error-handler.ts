import { NextFunction, Request, Response, RequestHandler } from "express";
import { ErrorCode, HttpException } from "./exceptions/root";
import { InternalException } from "./exceptions/internal-exception";
import { ZodError } from "zod";
import { BadRequestException } from "./exceptions/bad-request";

export const errorHandler = (
  method: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
  return async (req, res, next) => {
    try {
      await method(req, res, next);
    } catch (error) {
      let exception: HttpException;
      if (error instanceof HttpException) {
        exception = error;
      } else {
        if (error instanceof ZodError) {
          exception = new BadRequestException(error.message, ErrorCode.UNPROCESSABLE_ENTITY);
        } else {
          exception = new InternalException(error);
        }
      }
      next(exception);
    }
  };
};
