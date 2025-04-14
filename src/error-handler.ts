import { NextFunction, Request, Response, RequestHandler } from "express";
import { HttpException } from "./exceptions/root";
import { InternalException } from "./exceptions/internal-exception";

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
        exception = new InternalException(error);
      }
      next(exception);
    }
  };
};
