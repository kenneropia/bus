import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EntityType } from "src/api/schema";
import API from "src/api";
import useAuth from "src/hooks/useAuth";

const Ride = () => {
  type TypedJourney = EntityType.Journey & { driver: EntityType.User } & {
    student: EntityType.User;
  } & {
    seatNumber: number;
  };
  const [journey, setJourney] = useState<TypedJourney | null>(null);
  const { journeyId } = useParams();
  const auth = useAuth();

  useEffect(() => {
    const fetchJourney = async () => {
      if (journeyId) {
        const response = await API.get(`/journey/${journeyId}`);

        if (Object.keys(response.data.journey).length) {
          return setJourney(response.data.journey);
        }
      }
      const response = await API.get(`/journey/current`);

      if (Object.keys(response.data.journey).length) {
        return setJourney(response.data.journey);
      }
      // setJourney(response.data.journey);
    };
    fetchJourney();
  }, [journeyId]);

  return (
    <div className="max-w-md p-6 mx-auto mt-2 bg-gray-200 rounded-md shadow-md">
      <h2 className="mb-4 text-lg font-bold text-center">RIDE RECEIPT</h2>
      {journey ? (
        <>
          <div>
            <p className="mb-2 text-sm text-gray-700">
              <span className="mr-2 font-bold">Journey ID:</span>
              {journey.id}
            </p>
            <p className="mb-2 text-sm text-gray-700">
              <span className="mr-2 font-bold">Driver:</span>
              {journey.driver.name}
            </p>
            <p className="mb-2 text-sm text-gray-700">
              <span className="mr-2 font-bold">Destination:</span>
              {journey.destination}
            </p>
            <p className="mb-2 text-sm text-gray-700">
              <span className="mr-2 font-bold">Date:</span>
              {journey.date as unknown as string}
            </p>
            <p className="mb-2 text-sm text-gray-700">
              <span className="mr-2 font-bold">Section:</span>
              <span className="capitalize">{journey.section}</span>
            </p>
            <p className="mb-2 text-sm text-gray-700">
              <span className="mr-2 font-bold">Finished:</span>
              {journey.finished ? "Yes" : "No"}
            </p>
          </div>
          <hr className="my-2" />
          {auth.getUser()?.role == "student" && (
            <>
              <div>
                <h2 className="mb-2 font-bold text-md">STUDENT INFORMATION</h2>
                <p className="mb-2 text-sm text-gray-700">
                  <span className="mr-2 font-bold">Student Name:</span>
                  {journey.student.name}
                </p>
                <p className="mb-2 text-sm text-gray-700">
                  <span className="mr-2 font-bold">Student ID:</span>
                  {journey.student.id}
                </p>
                <p className="mb-2 text-sm text-gray-700">
                  <span className="mr-2 font-bold">Student Email:</span>
                  {journey.student.email}
                </p>
                <p className="mb-2 text-sm text-gray-700">
                  <span className="mr-2 font-bold">Seat No:</span>
                  {journey.seatNumber}
                </p>
              </div>
              <hr className="my-2" />
            </>
          )}
          <hr className="my-2" />
          <div className="text-sm text-center">
            <p className="mb-1">THANK YOU FOR RIDING WITH US!</p>
            <p className="mb-1">
              PLEASE KEEP YOUR RECEIPT AS PROOF OF PAYMENT AND BOARDING
            </p>
            <p>HAVE A SAFE TRIP!</p>
          </div>
        </>
      ) : auth.getUser()?.role == "student" ? (
        <p>Journey not found, book a ride please</p>
      ) : (
        <> No student has booked a ride</>
      )}
    </div>
  );
};

export default Ride;
