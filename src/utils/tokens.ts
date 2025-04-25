import * as jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_SECRET_REFRESH } from "../secrets";

const generateAccessToken = (userId: number) => jwt.sign({ userId }, JWT_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (userId: number) => jwt.sign({ userId }, JWT_SECRET_REFRESH, { expiresIn: "7d" });

export { generateAccessToken, generateRefreshToken };
