import { Request, Response, Router } from "express";
import { validateRequestBody } from "zod-express-middleware";
import { isAuth, roleChecker } from "src/utils/helpers";
import {
  login,
  signup,
  profile,
  deleteUserById,
  getAllUsers,
  verifyUserById,
} from "./user.controller";
import { loginSchema } from "./user.schema";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("file", file);
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ogFileNameSplit = file.originalname.split(".");

    req.body.filename = `images/${ogFileNameSplit[ogFileNameSplit.length - 1]}`;
    cb(null, `${req.body.name}.${ogFileNameSplit[ogFileNameSplit.length - 1]}`);
  },
});
const userRouter = Router();

const upload = multer({ storage: storage });

userRouter.post("/signup", upload.single("licence"), signup);
userRouter.get("/", isAuth, roleChecker("admin"), getAllUsers);

userRouter.post("/login", validateRequestBody(loginSchema), login);

userRouter.get("/me", isAuth, profile);

userRouter.delete("/:userId", isAuth, roleChecker("admin"), deleteUserById);

userRouter.patch(
  "/:userId/verify",
  isAuth,
  roleChecker("admin"),
  verifyUserById
);

export default userRouter;
