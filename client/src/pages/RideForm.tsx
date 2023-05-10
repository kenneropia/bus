import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API from "src/api";
import { destinations, getSectionOfDay } from "src/utils/helpers";

const nums = [1, 2, 3, 4, 5, 6, 7, 8];

function BusRadio({
  setSeatNumber,
  availableSeats,
}: {
  availableSeats: number[];
  setSeatNumber: React.Dispatch<React.SetStateAction<string>>;
}) {
  const seatsObject: Record<number, number> = {};
  availableSeats.forEach((item) => (seatsObject[item] = item));
  const handleSeatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSeatNumber(event.target.value);
    console.log(availableSeats);
    // setSeatNumber(event.target.value);
  };
  return (
    <div className="mb-4">
      <fieldset className="flex flex-col items-start w-fit">
        <label
          className="block mb-2 font-bold text-gray-700"
          htmlFor="seatNumber"
        >
          Choose a seat:
        </label>
        <div>
          <label>Seat Number 1:</label>
          <input
            className="inline-flex ml-0.5 mr-2"
            onChange={handleSeatChange}
            type="radio"
            id={`${1}`}
            defaultChecked={!Boolean(seatsObject[1])}
            disabled={!Boolean(seatsObject[1])}
            name="seatNumber"
            value={1}
          />
          <label>Seat Number 2:</label>
          <input
            className="inline-flex ml-0.5 mr-2"
            onChange={handleSeatChange}
            type="radio"
            id={`${1}`}
            defaultChecked={!Boolean(seatsObject[2])}
            disabled={!Boolean(seatsObject[2])}
            name="seatNumber"
            value={2}
          />
        </div>
        <div>
          <label>Seat Number 3:</label>
          <input
            className="inline-flex ml-0.5 mr-2"
            onChange={handleSeatChange}
            type="radio"
            name="seatNumber"
            disabled={!Boolean(seatsObject[3])}
            defaultChecked={!Boolean(seatsObject[3])}
            value={3}
          />
          <label>Seat Number 4:</label>
          <input
            className="inline-flex ml-0.5 mr-2"
            onChange={handleSeatChange}
            type="radio"
            name="seatNumber"
            disabled={!Boolean(seatsObject[4])}
            defaultChecked={!Boolean(seatsObject[4])}
            value={4}
          />
          <label>Seat Number 5:</label>
          <input
            className="inline-flex ml-0.5 mr-2"
            onChange={handleSeatChange}
            type="radio"
            name="seatNumber"
            disabled={!Boolean(seatsObject[5])}
            defaultChecked={!Boolean(seatsObject[5])}
            value={5}
          />
        </div>
        <div>
          <label>Seat Number 6:</label>
          <input
            className="inline-flex ml-0.5 mr-2"
            onChange={handleSeatChange}
            type="radio"
            name="seatNumber"
            disabled={!Boolean(seatsObject[6])}
            defaultChecked={!Boolean(seatsObject[6])}
            value={6}
          />
          <label>Seat Number 7:</label>
          <input
            className="inline-flex ml-0.5 mr-2"
            onChange={handleSeatChange}
            type="radio"
            name="seatNumber"
            disabled={!Boolean(seatsObject[7])}
            defaultChecked={!Boolean(seatsObject[7])}
            value={7}
          />
          <label>Seat Number 8:</label>
          <input
            className="inline-flex ml-0.5 mr-2"
            onChange={handleSeatChange}
            type="radio"
            name="seatNumber"
            disabled={!Boolean(seatsObject[8])}
            defaultChecked={!Boolean(seatsObject[8])}
            value={8}
          />
        </div>
      </fieldset>
    </div>
  );
}

const RideForm = () => {
  const [destination, setDestination] = useState<number | undefined>();
  const [availableSeats, setAvailableSeats] = useState([]);
  const [seatNumber, setSeatNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailableSeats = async () => {
      try {
        const response = await API.get(
          `/journey/${destination}/get-available-seats`
        );
        setAvailableSeats(response.data.availableSits);
      } catch (error: any) {
        setErrorMessage(error.response.data.message);
        console.log(error);
      }
    };
    if (Number.isInteger(destination)) {
      fetchAvailableSeats();
    }
  }, [destination]);

  const handleDestinationChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDestination(+event.target.value);
    setSeatNumber("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await API.post("/journey/book-seat", {
        destination,
        section: getSectionOfDay(),
        seatNumber: +seatNumber,
      });
      toast.success("Ride booked successfully");
      navigate("/");
      // do something with the response
    } catch (error: any) {
      setErrorMessage(error.response.data.message);
      console.log(error);
    }
  };

  return (
    <form
      className="max-w-md p-4 mx-auto mt-8 rounded-md shadow-md"
      onSubmit={handleSubmit}
    >
      <div className="mb-4">
        <label
          htmlFor="destination"
          className="block mb-2 font-bold text-gray-700"
        >
          Destination:
        </label>
        <select
          name="destination"
          value={destination}
          onChange={handleDestinationChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select a destination</option>
          {destinations.map((item, id) => (
            <option key={id} value={id}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {availableSeats.length ? (
        <BusRadio
          availableSeats={availableSeats}
          setSeatNumber={setSeatNumber}
        />
      ) : null}
      {errorMessage && (
        <p className="text-sm font-medium text-red-500">{errorMessage}</p>
      )}
      <button
        type="submit"
        disabled={!Number.isInteger(destination) || !seatNumber}
        className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded disabled:opacity-20 hover:bg-blue-700"
      >
        Book Seat
      </button>
    </form>
  );
};

export default RideForm;
