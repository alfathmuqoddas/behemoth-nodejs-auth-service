import { Request, Response } from "express";
import { UniqueConstraintError } from "sequelize";
import type { AuthRequest } from "../middleware/authMiddleware";
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
  const { email, password, firstName, lastName, userName } = req.body;

  try {
    if (!email || !password || !firstName || !lastName || !userName) {
      logger.warn(`Login attempt with missing email or password`);
      return res.status(400).json({ message: "Missing email or password." });
    }
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      userName,
      role: "user",
    });

    userRegistrations.inc();

    logger.info({ userId: user.id }, "User registered successfully");
    res.status(201).json({ id: user.id, email: user.email });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      logger.warn({ email }, "Registration attempt with existing email");
      return res.status(409).json({
        message: "Email is already registered.",
      });
    }
    logger.error({ error }, "Error registering new user.");
    res.status(500).json({ message: "Error registering new user.", error });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      logger.warn(`Login attempt with unregistered email: ${email}`);
      return res.status(404).json({ message: "User not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      logger.warn(`Login attempt with invalid for user: ${email}`);
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      privateKey,
      {
        algorithm: "RS256",
        expiresIn: "1h",
      }
    );

    const {
      password: userPassword,
      createdAt,
      updatedAt,
      ...userResponse
    } = user.toJSON();

    logger.info(`User logged in: ${email}`);
    userLogins.inc({ result: "success" });
    res.status(200).json({
      token,
      user: userResponse,
    });
  } catch (error) {
    userLogins.inc({ result: "failure" });
    logger.error({ error }, "Error logging in user.");
    res.status(500).json({ message: "Error logging in.", error });
  }
};

export const getUserDetails = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      logger.warn(`User with id ${id} not found`);
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    logger.error({ error }, "Error retrieving user details.");
    res.status(500).json({ message: "Error retrieving user details.", error });
  }
};

export const updateUserDetails = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { email, password, role, firstName, lastName, userName, avatar } =
    req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      logger.warn(`User with id ${id} not found`);
      return res.status(404).json({ message: "User not found." });
    }

    const updates: Partial<User> = {};

    if (email) updates.email = email;
    if (password) updates.password = await bcrypt.hash(password, 10);
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (userName) updates.userName = userName;
    if (avatar) updates.avatar = avatar;

    if (role) {
      if (req.user?.role !== "admin") {
        logger.warn(`Unauthorized role change attempt by ${req.user?.id}`);
        return res.status(403).json({
          message: "You are not allowed to change user roles.",
        });
      }
      updates.role = role;
    }

    await user.update(updates);
    const sanitizedUser = user.toJSON();
    delete sanitizedUser.password;
    res.status(200).json(sanitizedUser);
  } catch (error) {
    logger.error({ error, userId: id }, "Error updating user details.");
    res.status(500).json({ message: "Error updating user details.", error });
  }
};
