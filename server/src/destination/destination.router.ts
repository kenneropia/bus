import { Router } from "express";
import { validateRequestBody } from "zod-express-middleware";
import { isAuth, roleChecker } from "src/utils/helpers";
import {
  getAvailableDestinationsForNewDrivers,
  getDestinationsWithDrivers,
} from "./destination.controller";
// import { updateNoteSchema } from "./distination.schema";

const destinationRouter = Router();

// const checkStudent = roleChecker("admin");
// destinationRouter.use(isAuth);
destinationRouter.get("/", getDestinationsWithDrivers);
destinationRouter.get("/generate-slots", getAvailableDestinationsForNewDrivers);

export default destinationRouter;
