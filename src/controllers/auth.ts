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
  res.json(user);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  let user = await prismaClient.user.findFirst({
    where: { email },
  });
  if (!user) {
    throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }
  if (!compareSync(password, user.password)) {
    throw new BadRequestException("Invalid credentials", ErrorCode.INVALID_CREDENTIALS);
  }
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });
  res.json({ user, token_type: "Bearer", access_token: token });
};

export const me = async (req: Request, res: Response) => {
  res.json(req.user);
};
