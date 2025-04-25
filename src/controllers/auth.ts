import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { compareSync, hashSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions/root";
import { SignupSchema } from "../schema/user";
import { NotFoundException } from "../exceptions/not-found";
import { access } from "fs";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens";
import { UnauthorizedException } from "../exceptions/unauthorized";

export const signup = async (req: Request, res: Response) => {
  SignupSchema.parse(req.body);
  const { email, password, name } = req.body;
  let user = await prismaClient.user.findFirst({
    where: { email },
  });
  if (user) {
    throw new BadRequestException("User already exists", ErrorCode.USER_ALREADY_EXISTS);
  }
  user = await prismaClient.user.create({
    data: {
      email,
      password: hashSync(password, 10),
      name,
    },
  });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prismaClient.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  res.json({
    token_type: "Bearer",
    access_token: accessToken,
    refresh_token: refreshToken,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prismaClient.user.findFirst({ where: { email } });

  if (!user || !compareSync(password, user.password)) {
    throw new BadRequestException("Invalid credentials", ErrorCode.INVALID_CREDENTIALS);
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prismaClient.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  res.json({
    token_type: "Bearer",
    access_token: accessToken,
    refresh_token: refreshToken,
  });
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      throw new BadRequestException("Refresh token is required", ErrorCode.INVALID_CREDENTIALS);
    }

    const storedToken = await prismaClient.refreshToken.findFirst({
      where: { token: refresh_token },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException();
    }

    const newAccessToken = jwt.sign({ userId: storedToken.userId }, JWT_SECRET, { expiresIn: "15m" });

    res.json({
      token_type: "Bearer",
      access_token: newAccessToken,
    });
  } catch (error) {
    throw new UnauthorizedException();
  }
};

export const me = async (req: Request, res: Response) => {
  res.json(req.user);
};
