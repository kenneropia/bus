import { User } from "@prisma/client";
import { roleEnum } from "src/user/user.schema";
import { z } from "zod";

declare global {
  namespace Express {
    export interface Request {
      user: Omit<User, "password">;
      headers: {
        authorization: string;
      };
    }
  }
}
