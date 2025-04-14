import { ErrorCode, HttpException } from "./root";

export class UnauthorizedException extends HttpException {
  constructor() {
    super("Unauthorized", ErrorCode.UNAUTHORIZED, 401, null);
  }
}
