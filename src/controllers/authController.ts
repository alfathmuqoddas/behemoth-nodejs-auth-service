import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import User from "../models/User";
import logger from "../config/logger";
import { userRegistrations, userLogins } from "../config/metrics";

const privateKey = fs.readFileSync(
  path.join(__dirname, "../../keys/private.pem"),
  "utf8"
);

export const register = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, role });
    logger.info(`User registered: ${user.email}`);
    userRegistrations.inc();
    res.status(201).json({ id: user.id, email: user.email });
  } catch (error) {
    logger.error({ error }, "Error registering new user.");
    res.status(500).json({ message: "Error registering new user.", error });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      logger.warn(`Login attempt with unregistered email: ${email}`);
      return res.status(404).json({ message: "User not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      logger.warn(`Login attempt with invalid password for user: ${email}`);
      return res.status(401).json({ message: "Invalid password." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      privateKey,
      {
        algorithm: "RS256",
        expiresIn: "1h",
      }
    );

    logger.info(`User logged in: ${email}`);
    userLogins.inc();
    res.status(200).json({ token });
  } catch (error) {
    logger.error({ error }, "Error logging in user.");
    res.status(500).json({ message: "Error logging in.", error });
  }
};
