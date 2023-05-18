import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";

import db from "../db";
import { log } from "console";
import { z } from "zod";
import { roleEnum } from "src/user/user.schema";
export const createToken = (user: { email: string; id: string }) => {
  return jwt.sign(user, "thisShouldBeMovedToDotEnvLater", {
    expiresIn: 60 * 60 * 24 * 20,
  });
};

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "UNAUTHORIZED" });
  }
  const token = req.headers.authorization.split(" ")[1];

  // console.log(token);

  const payload = jwt.verify(token, "thisShouldBeMovedToDotEnvLater") as {
    id: string;
  };
  const user = await db.user.findUnique({
    where: { id: payload.id },
  });

  if (!user) {
    return res.status(404).json({
      code: "NOT_FOUND",
      message: "This user doesn't exist",
    });
  }

  req.user = user;
  next();
};

export const isCorrect = async (passwordHash: string, rawPassword: string) =>
  await bcrypt.compare(rawPassword, passwordHash);

export const destinations = [
  "Al-Hikmah - Post Office",
  "Al-Hikmah - Airport Road",
  "Al-Hikmah - Tipper Garage",
  "Al-Hikmah - Olunlade",
  "Al-Hikmah - Sango",
  "Al-Hikmah - GRA",
];

export const sections = ["morning", "afternoon", "evening"];

export const roleChecker =
  (roles: z.infer<typeof roleEnum>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (roles.includes(req.user.role)) return next();
    return res
      .status(403)
      .json({ status: "error", message: "unauthorized access" });
  };

export function getCurrentDate() {
  const now = new Date();
  const day = now.getDay();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");

  const dateString = `${year}/${month}/${day}`;
  return dateString;
}
export function getSectionOfDay() {
  let hour = new Date().getHours();

  hour = hour > 12 ? hour - 12 : hour;

  if (hour >= 8 && hour < 12) {
    return `Morning at ${hour}`;
  } else if (hour >= 12 && hour < 16) {
    return `Afternoon at ${hour}`;
  } else {
    return `Evening at ${hour}`;
  }
}

export const getWeekFromMonth = async (dateString: string) => {
  const date = new Date();

  const dayOfWeek = date.getDay(); // Returns a number from 0 to 6
  const weekOfDay = Math.floor(dayOfWeek / 7) + 1; // Returns the week of the day (1-5)
  return weekOfDay;
};

export function getWeekStartAndEndDates() {
  const date = new Date();
  // Get the day of the week (0-6)
  const dayOfWeek = date.getUTCDay();

  // Calculate the start date of the week
  const weekStartDate = new Date(date);
  weekStartDate.setUTCDate(date.getUTCDate() - dayOfWeek);
  // Calculate the end date of the week
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setUTCDate(weekStartDate.getUTCDate() + 6);

  // Return the start and end dates as ISO strings
  return {
    startDate: weekStartDate.toISOString(),
    endDate: weekEndDate.toISOString(),
  };
}
