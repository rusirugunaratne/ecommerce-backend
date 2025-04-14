import { ErrorCode, HttpException } from "./root";

export class InternalException extends HttpException {
  constructor(errors: any) {
    super("Something went wrong!", ErrorCode.INTERNAL_EXCEPTION, 500, errors);
  }
}
