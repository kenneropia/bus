import { Request, Response } from "express";
import { z } from "zod";
import db from "src/db";
import { destinations, getCurrentDate } from "src/utils/helpers";
import { User } from "@prisma/client";
// import { createjourneySchema } from "./journey.schema";

export const getDestinationsWithDrivers = async (
  req: Request,
  res: Response
) => {
  const driversWithLessThanThreeJourneys = await db.user.findMany({
    where: {
      role: "driver",
      destination: {
        in: destinations,
      },
      journeys: {
        some: {
          date: getCurrentDate(),
        },
      },
    },
    select: {
      id: true,
      name: true,
      journeys: {
        where: {
          date: getCurrentDate(),
        },
        take: 3,
      },
      destination: true,
    },
    orderBy: {
      journeys: {
        _count: "asc",
      },
    },
  });

  const destinationsWithDrivers: Record<(typeof destinations)[number], any> =
    {};
  driversWithLessThanThreeJourneys.forEach((item) => {
    if (destinationsWithDrivers[item.destination as string]) {
      destinationsWithDrivers[item.destination as string].push(item);
    } else {
      destinationsWithDrivers[item.destination as string] = [item];
    }
  });

  console.log(destinationsWithDrivers);

  return res.json({ destinations: destinationsWithDrivers });
};
export const getAvailableDestinationsForNewDrivers = async (
  req: Request,
  res: Response
) => {
  const groupedDestinations = await db.user.groupBy({
    by: ["destination"],
    _count: {
      destination: true,
    },
    where: {
      role: "driver",
    },
  });

  const destinationsValues: Record<(typeof destinations)[number], string> = {};

  destinations.forEach((item) => {
    destinationsValues[item] = item;
  });

  groupedDestinations.forEach((item) => {
    if (destinationsValues[item.destination!] && item._count.destination > 2) {
      delete destinationsValues[item.destination!];
    }
  });

  return res.json({ destinations: Object.values(destinationsValues) });
};
