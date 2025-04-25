import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";
import { ErrorCode } from "../exceptions/root";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) throw new UnauthorizedException();

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as { userId: number };

    const user = await prismaClient.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true },
    });

    if (!user) throw new UnauthorizedException();

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedException());
    }
    next(new UnauthorizedException());
  }
};

export default authMiddleware;
