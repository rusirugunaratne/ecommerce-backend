import { ErrorCode, HttpException } from "./root";

export class UnprocessableEntityException extends HttpException {
  constructor(message: string) {
    super(message, ErrorCode.UNPROCESSABLE_ENTITY, 400, null);
  }
}
