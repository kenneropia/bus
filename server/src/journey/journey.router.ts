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
  cancelJourney
} from "./journey.controller";
// import { updateNoteSchema } from "./journey.schema";

const journeyRouter = Router();

journeyRouter.use(isAuth);

journeyRouter.post("/", roleChecker("admin"), createJourney);

journeyRouter.get("/current", getCurrentJourney);
journeyRouter.get("/", getAllJourneys);

journeyRouter.post("/book-seat", bookSeat);

journeyRouter.get("/journey-summary", getJourneySummary);
journeyRouter.get("/:journeyId", getAJourney);

journeyRouter.delete("/:journeyId", deleteJourney);
journeyRouter.patch("/:journeyId/finish", finishJourney);

journeyRouter.delete("/:journeyId/cancel", cancelJourney);
journeyRouter.get("/:destinationId/get-available-seats", getAvailableSeats);
// journeyRouter.patch(
//   "/:noteId",
//   isAuth,
//   validateRequestBody(updateNoteSchema),
//   updateNote
// );

// journeyRouter.delete("/:noteId", isAuth, deleteNote);

export default journeyRouter;
