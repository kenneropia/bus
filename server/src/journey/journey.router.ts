import { Router } from "express";
import { validateRequestBody } from "zod-express-middleware";
import { isAuth, roleChecker } from "src/utils/helpers";
import {
  getAllJourneys,
  getAJourney,
  getAavailableSeats as getAvailableSeats,
  bookSeat,
  createJourney,
  finishJourney,
  getCurrentJourney,
  deleteJourney,
  getJourneySummary,
} from "./journey.controller";
// import { updateNoteSchema } from "./journey.schema";

const journeyRouter = Router();

const checkStudent = roleChecker("student");
journeyRouter.use(isAuth);

journeyRouter.post("/", roleChecker("admin"), createJourney);

journeyRouter.get("/current", getCurrentJourney);
journeyRouter.get("/", getAllJourneys);

journeyRouter.post("/book-seat", bookSeat);

journeyRouter.get("/journey-summary", roleChecker("admin"), getJourneySummary);
journeyRouter.get("/:journeyId", getAJourney);

journeyRouter.delete("/:journeyId", roleChecker("admin"), deleteJourney);
journeyRouter.patch("/:journeyId/finish", finishJourney);
journeyRouter.get("/:destinationId/get-available-seats", getAvailableSeats);
// journeyRouter.patch(
//   "/:noteId",
//   isAuth,
//   validateRequestBody(updateNoteSchema),
//   updateNote
// );

// journeyRouter.delete("/:noteId", isAuth, deleteNote);

export default journeyRouter;
