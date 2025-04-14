import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      next(new UnauthorizedException());
    }
    const token = authHeader!.split(" ")[1];
    const payload = jwt.verify(token!, JWT_SECRET) as any;
    const user = await prismaClient.user.findFirst({
      where: {
        id: payload.userId,
      },
    });
    if (!user) {
      next(new UnauthorizedException());
    }
    req.user = user!;
    next();
  } catch (error) {
    next(new UnauthorizedException());
  }
};

export default authMiddleware;
