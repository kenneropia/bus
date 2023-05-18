import { Request, Response } from "express";
import { z } from "zod";
import db from "src/db";
import {
  destinations,
  getCurrentDate,
  getSectionOfDay,
  getWeekFromMonth,
  getWeekStartAndEndDates,
} from "src/utils/helpers";
import { Prisma } from "@prisma/client";
// import { createjourneySchema } from "./journey.schema";

export const getJourneySummary = async (req: Request, res: Response) => {
  const now = new Date();

  const month = (now.getMonth() + 1).toString().padStart(2, "0");

  const dateString = `${month}`;

  const weekDate = getWeekStartAndEndDates();
  const weeklyJourneys = await db.journey.findMany({
    where: {
      createdAt: {
        lte: weekDate.endDate,
        gte: weekDate.startDate,
      },
    },
  });

  const weeklyJourneysCount = await db.journey.count({
    where: {
      createdAt: {
        lte: weekDate.endDate,
        gte: weekDate.startDate,
      },
    },
  });

  const weeklyFinishedJourneysCount = await db.journey.count({
    where: {
      createdAt: {
        lte: weekDate.endDate,
        gte: weekDate.startDate,
      },
      finished: true,
    },
  });

  const monthlyJourneysCount = await db.journey.count({
    where: {
      date: {
        contains: dateString,
      },
    },
  });
  const monthlyFinishedJourneyCount = await db.journey.count({
    where: {
      finished: true,
      date: {
        contains: dateString,
      },
    },
  });

  const totalStudentsCount = await db.user.count({
    where: {
      role: "student",
    },
  });
  const totalDriversCount = await db.user.count({
    where: {
      role: "driver",
    },
  });
  return res.json({
    monthlyFinishedJourneyCount,
    monthlyJourneysCount,
    totalDriversCount,
    totalStudentsCount,
    weeklyFinishedJourneysCount,
    weeklyJourneysCount,
  });
};

export const deleteJourney = async (req: Request, res: Response) => {
  const journey = await db.journey.delete({
    where: {
      id: req.params.journeyId,
    },
  });
  return res.json({ journey });
};

export const finishJourney = async (req: Request, res: Response) => {
  const journey = await db.journey.findFirst({
    where: {
      driverId: req.user.id,
      id: req.params.journeyId,
    },
  });
  if (!journey) {
    return res.status(403).json({ status: "error", message: "Ride not found" });
  }
  await db.journey.update({
    where: {
      id: req.params.journeyId,
    },
    data: {
      finished: true,
    },
  });
  return res.json({ journey: { ...journey, finished: true } });
};

export const createJourney = async (req: Request, res: Response) => {
  const currentDate = getCurrentDate();

  const existingJourney = await db.journey.findFirst({
    where: {
      date: currentDate,
      destination: req.body.destination,
      section: req.body.section,
    },
  });

  if (existingJourney) {
    return res.json({ journey: { journey: existingJourney } });
  }

  const newJourney = await db.journey.create({
    data: {
      destination: req.body.destination,
      section: req.body.section,
      date: currentDate,
      driverId: req.body.driverId,
    },
  });
  return res.json({ journey: newJourney });
};

export const getAJourney = async (req: Request, res: Response) => {
  const journey = await db.journey.findFirst({
    where: {
      id: req.params.journeyId,
    },
    include: {
      driver: true,
      seats: {
        where: {
          studentId: req.user.id,
        },
        include: {
          student: true,
        },
      },
    },
  });
  const student =
    journey && req.user.role == "student" && journey?.seats[0].student;

  const resJourney = { ...journey, student };
  return res.json({
    journey: resJourney,
  });
};

export const getCurrentJourney = async (req: Request, res: Response) => {
  let journey = null;

  if (req.user.role == "student") {
    journey = await db.journey.findFirst({
      where: {
        date: getCurrentDate(),
        section: getSectionOfDay(),
      },

      include: {
        driver: true,

        seats: {
          where: {
            studentId: req.user.id,
          },
          include: {
            student: true,
          },
        },
      },
    });
    const studentObj = journey?.seats?.length
      ? {
        student: journey.seats[0].student,
        seatNumber: journey.seats[0].seatNumber,
      }
      : {};

    journey = { ...journey, ...studentObj };
  } else {
    journey = await db.journey.findFirst({
      where: {
        driverId: req.user.id,
        date: getCurrentDate(),
        section: getSectionOfDay(),
      },
      include: {
        driver: true,
      },
    });
  }
  return res.json({ journey });
};



export const cancelJourney = async (req: Request, res: Response) => {
  const journeyId = req.params.journeyId
  const seat = await db.seat.findFirst({
    where: {
      journeyId,
      studentId: req.user.id
    }
  })
  await db.seat.delete({
    where: {
      id: seat?.id
    }
  })
  res.status(204).json({})
}

export const getAllJourneys = async (req: Request, res: Response) => {
  console.log(req.user.role);

  const searchQuery: Prisma.JourneyFindManyArgs = req.query.search
    ? {
      where: {
        OR: [
          {
            id: {
              contains: req.query.search as string,
            },
          },
          { date: { contains: req.query.search as string } },
          { destination: { contains: req.query.search as string } },

          { section: { contains: req.query.search as string } },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    }
    : {};

  let journeys = undefined;
  if (req.user.role == "student") {
    journeys = await db.journey.findMany({
      where: {
        seats: {
          some: {
            studentId: req.user.id,
          },
        },
        ...searchQuery.where,
      },
      orderBy: searchQuery.orderBy,
      include: {
        seats: true,
        driver: true
      },
    });
  }

  if (req.user.role == "driver") {
    journeys = await db.journey.findMany({
      where: {
        driverId: req.user.id,

        ...searchQuery.where,
      },
      orderBy: searchQuery.orderBy,
    });
    console.log(journeys);
  }

  if (req.user.role == "admin") {
    journeys = await db.journey.findMany({
      ...searchQuery,
      include: {
        seats: true,
      },
    });
  }


  return res.json({ journeys });
};

export const getAavailableSeats = async (req: Request, res: Response) => {
  const occupiedSits = await db.seat.findMany({
    where: {
      journey: {
        section: getSectionOfDay(),
        destination:
          destinations[req.params.destinationId as unknown as number],
      },
    },
    select: { seatNumber: true },
  });
  const occupiedSitsArray = occupiedSits.map((seat) => seat.seatNumber);
  const allSitsArray = Array.from({ length: 8 }, (_, i) => i + 1);
  const availableSits = allSitsArray.filter(
    (seatNumber) => !occupiedSitsArray.includes(seatNumber)
  );

  return res.json({ availableSits });
};

export async function bookSeat(req: Request, res: Response) {
  const destination = destinations[+req.body.destination];
  const journey = await db.journey.findFirst({
    where: {
      destination,
      section: getSectionOfDay(),
      date: getCurrentDate(),
    },
    select: {
      _count: true,
      id: true,
    },
  });

  console.log(journey);
  if (journey) {
    const occupiedSeat = await db.seat.findFirst({
      where: {
        studentId: req.user.id,
        journeyId: journey?.id,
      },
    });

    if (occupiedSeat) {
      return res.status(409).json({
        status: "error",
        message: "You already booked this ride before",
      });
    }
    if (journey?._count.seats == 8) {
      return res
        .status(409)
        .json({ status: "error", message: "This bus is filled up already" });
    }
    console.log("userr", req.user.id);
    if (journey?._count.seats <= 8) {
      const seat = await db.seat.create({
        data: {
          studentId: req.user.id,
          seatNumber: req.body.seatNumber,
          journeyId: journey.id,
        },
      });

      return res.json({ seat });
    }
  }

  const driverWithLessThanThreeJourney = await db.user.findFirst({
    where: {
      role: "driver",
      destination,
      verified: true,
      journeys: {
        none: {
          date: getCurrentDate(),
          section: getSectionOfDay(),
        },
      },
    },
    select: {
      id: true,
      name: true,

      destination: true,
    },
  });
  if (!driverWithLessThanThreeJourney) {
    return res.status(409).json({
      status: "error",
      message: "driver not available for this destination",
    });
  }
  const newJourney = await db.journey.create({
    data: {
      destination: destination,
      section: getSectionOfDay(),
      date: getCurrentDate(),
      driverId: driverWithLessThanThreeJourney.id,
      seats: {
        create: {
          studentId: req.user.id,
          seatNumber: req.body.seatNumber,
        },
      },
    },
  });
  return res.json({ journey: newJourney });
  // if (!journey) {
  //   return res
  //     .status(402)
  //     .json({ status: "error", message: "Journey does not exist" });
  // }
  // Check if the seat is already occupied
}

// const updatejourney = async (
//   req: Request<any, any, z.infer<typeof updatejourneySchema>>,
//   res: Response
// ) => {
//   const journey = await db.journey.update({
//     where: {
//       id: req.params.journeyId,
//     },
//     data: { ...req.body, userId: req.user!.id },
//   });

//   return res.json({ journey });
// };

// const deletejourney = async (req: Request, res: Response) => {
//   try {
//     await db.journey.findUniqueOrThrow({ where: { id: req.params.journeyId } });
//   } catch (err) {
//     return res.status(404).json({ message: "not found" });
//   }

//   const journey = await db.journey.delete({
//     where: {
//       id: req.params.journeyId,
//     },
//   });

//   return res.json({ journey });
// };
