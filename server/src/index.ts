import express, { NextFunction, Request, Response } from "express";
import db from "src/db";
import userRouter from "./user/user.router";
import journeyRouter from "./journey/journey.router";
import destinationRouter from "src/destination/destination.router";
import cors from "cors";
const app = express();

app.use("/images", express.static("uploads"));

app.use(express.static("static"));

app.use(cors());

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

import swaggerUi from "swagger-ui-express";

import swaggerDocument from "../swagger.json";
import path from "path";

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/user", userRouter);
app.use("/api/journey", journeyRouter);
app.use("/api/destination", destinationRouter);
app.use("/api/cart", destinationRouter);

// app.get("*", function (req, res) {
//   res.sendFile("landing.html", { root: path.join(__dirname, "../static") });
// });

app.all("*", (req, res) => {
  return res.status(404).json({ message: "route not found" });
});

app.use(async (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  return res.status(500).json({ message: "internal server error" });
});
const PORT = (process.env.PORT as unknown as number) || 3000;
const main = async () => {
  try {
    const server = app.listen(PORT, () => {
      console.log(`Server ready at: http://localhost:${PORT}`);
      // console.log(`docs ready at: http://localhost:${PORT}/docs`);
    });
  } catch (e: any) {
    console.error(e.message);
    await db.$disconnect();
    process.exit(1);
  }
};
main();

process.on("unhandledRejection", (reason: Error | any) => {
  console.log(`unhandledRejection: ${reason.message || reason}`);
});

process.on("uncaughtException", (err: Error) => {
  console.log(`uncaughtException: ${err.message}`);
});
