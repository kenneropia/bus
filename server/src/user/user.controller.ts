import { Request, Response } from "express";
import { z } from "zod";
import db from "src/db";
import { isCorrect, createToken } from "src/utils/helpers";
import { loginSchema } from "./user.schema";
import { Prisma } from "@prisma/client";

const signup = async (req: Request, res: Response) => {
  let user = await db.user.findFirst({
    select: { email: true, name: true, id: true, password: true },
    where: { email: req.body.email },
  });

  if (user) {
    return res.status(409).json({
      message: "This email is already used",
    });
  }
  let body;
  if (req.body.role == "student") {
    body = req.body;
  } else if (req.body.role == "driver") {
    body = req.body;
  } else {
    body = req.body;
  }

  delete body.licencePic;
  const { email, name, id } = await db.user.create({
    data: {
      ...body,
      driverLicense: req.body.filename,
      filename: undefined,
      verified: false,
    },
  });

  const token = createToken({ id, email });
  res.json({ user: { email, name, id }, token });
};

const login = async (
  { body }: Request<any, any, z.infer<typeof loginSchema>>,
  res: Response
) => {
  let user = await db.user.findFirst({
    select: { email: true, name: true, id: true, password: true, role: true,verified:true },
    where: { email: body.email },
  });
  if (!user) {
    return res.status(404).json({
      message: "wrong login details",
    });
  }

  if (!isCorrect(user.password!, body.password)) {
    return res.status(404).json({
      message: "wrong login details",
    });
  }

  const token = createToken({ email: user.email, id: user.id });
  user.password = null;
  res.json({ ...user, token });
};

const profile = async (req: Request, res: Response) => {
  const user = { ...req.user, password: null };
  return res.json(user);
};

export const getAllUsers = async (req: Request, res: Response) => {
  const searchQuery: Prisma.UserFindManyArgs = req.query.search
    ? {
        where: {
          OR: [
            {
              name: {
                contains: req.query.search as string,
              },
            },
            { email: { contains: req.query.search as string } },
            { destination: { contains: req.query.search as string } },
            { role: { contains: req.query.search as string } },
          ],
          NOT: {
            role: "admin",
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }
    : {};

  const users = await db.user.findMany({
    ...searchQuery,
  });
  return res.json({ users });
};

export const verifyUserById = async (req: Request, res: Response) => {
  const user = await db.user.update({
    where: {
      id: req.params.userId,
    },
    data: {
      verified: true,
    },
  });
  return res.json({ user });
};

export const deleteUserById = async (req: Request, res: Response) => {
  const user = await db.user.delete({
    where: {
      id: req.params.userId,
    },
  });
  return res.json({ user });
};

export { login, signup, profile };
