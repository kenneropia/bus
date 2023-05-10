import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { EntityType } from "src/api/schema";
import API from "src/api";
import useAuth from "src/hooks/useAuth";
import toast from "react-hot-toast";
import SearchForm from "src/components/SearchForm";
type TypedJourney = EntityType.Journey & { seats: EntityType.Seat[] };

const ActionGroupForJourney = ({
  journey,
  role,
  setJourneys,
  journeys,
}: {
  setJourneys: React.Dispatch<React.SetStateAction<TypedJourney[]>>;
  journey: TypedJourney;
  role: string;
  journeys: TypedJourney[];
}) => {
  const handleRideDelete = async (journeyId: string) => {
    try {
      const response = await API.delete(`/journey/${journeyId}`);
      console.log(response);
      toast.success("Ride deleted successfully");
      setJourneys(journeys.filter((item) => item.id !== journeyId));
      // do something with the response
    } catch (error: any) {
      toast(error.response.data.message);
      console.log(error);
    }
  };

  const handleRideFinish = async (journeyId: string) => {
    try {
      const response = await API.patch(`/journey/${journeyId}/finish`);
      toast.success("Ride finished successfully");
      setJourneys((prev) => {
        return prev.map((item) => {
          if (item.id !== journey.id) return item;
          return response.data.journey;
        });
      });
      // do something with the response
    } catch (error: any) {
      toast(error.response.data.message, { duration: 15 });
      console.log(error);
    }
  };
  if (role == "student") {
    return (
      <td className="p-3 text-sm text-gray-700">
        {journey.seats[0].seatNumber}
      </td>
    );
  }

  if (role == "driver") {
    return (
      <td className="p-3 text-sm text-gray-700">
        {!journey.finished ? (
          <button
            onClick={() => handleRideFinish(journey.id)}
            className="px-4 py-2 text-gray-700 transition-colors bg-blue-300 rounded-md hover:bg-gray-400 hover:text-gray-900"
          >
            Finish Ride
          </button>
        ) : (
          <span className="px-4 py-2 text-gray-700 transition-colors bg-green-300 rounded-md hover:bg-gray-400 hover:text-gray-900">
            Ride is done
          </span>
        )}
      </td>
    );
  }
  return (
    <td className="p-3 text-sm text-gray-700">
      <button
        onClick={() => handleRideDelete(journey.id)}
        className="px-4 py-2 text-gray-700 transition-colors bg-red-300 rounded-md hover:bg-gray-400 hover:text-gray-900"
      >
        Delete Ride
      </button>
    </td>
  );
};

const RideList = () => {
  const [journeys, setJourneys] = useState<TypedJourney[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<string>("");

  const auth = useAuth();

  useEffect(() => {
    const fetchJourneys = async () => {
      try {
        const response = await API.get("/journey", { params: { search } });
        setJourneys(response.data.journeys);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchJourneys();
  }, [search]);

  const pastJourneyStyle = "opacity-50";

  return (
    <div className="w-full p-4 mx-auto mt-6 overflow-auto border-2 border-gray-200 rounded-md">
      <SearchForm searchQuery={search} setSearchQuery={setSearch} />
      <h2 className="mb-4 text-2xl font-bold">List of Journeys</h2>
      {loading ? (
        <p>Loading journeys...</p>
      ) : journeys.length > 0 ? (
        <table className="w-full overflow-scroll text-sm table-auto">
          <thead className="border-b-2 border-gray-200 bg-gray-50">
            <tr className="">
              <th className="p-3 text-sm font-semibold tracking-wide text-left">
                Ride ID
              </th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">
                Destination
              </th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">
                Date
              </th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">
                Section
              </th>

              {auth.getUser()?.role == "driver" ? (
                <th className="p-3 text-sm font-semibold tracking-wide text-left">
                  Action
                </th>
              ) : (
                <th className="p-3 text-sm font-semibold tracking-wide text-left">
                  Seat Number
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {journeys.map((journey) => (
              <tr
                key={journey.id}
                className={`bg-gray-50 ${
                  journey.finished ? pastJourneyStyle : ""
                }`}
              >
                <td className="p-3 text-sm text-gray-700">
                  <Link
                    className="font-bold text-blue-500 hover:underline"
                    to={`/rides/${journey.id}`}
                  >
                    {journey.id}
                  </Link>
                </td>
                <td className="p-3 text-sm text-gray-700">
                  {journey.destination}
                </td>
                <td className="p-3 text-sm text-gray-700">
                  {journey.date as unknown as string}
                </td>
                <td className="p-3 text-sm text-gray-700 capitalize">
                  {journey.section}
                </td>
                <ActionGroupForJourney
                  journey={journey}
                  journeys={journeys}
                  setJourneys={setJourneys}
                  role={auth.getUser()?.role as string}
                />
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>
          No journery, yet.
          {auth.getUser()?.role == "student" && (
            <p>
              <Link to="/rides/new" className="text-blue-600 hover:underline">
                Click here
              </Link>
              <> to create a new ride.</>
            </p>
          )}
          {auth.getUser()?.role == "driver" &&
            (auth.getUser()?.verified ? (
              <p>Please wait a while to be scheduled a ride</p>
            ) : (
              <>
                Please wait a while to be verified, before you can be scheduled
                a ride
              </>
            ))}
        </p>
      )}
    </div>
  );
};

export default RideList;
