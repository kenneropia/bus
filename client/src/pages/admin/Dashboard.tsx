import { useState, useEffect } from "react";
import axios from "axios";
import API from "src/api";

const Dashboard = () => {
  const [summaryData, setSummaryData] = useState({
    monthlyJourneysCount: 0,
    monthlyFinishedJourneyCount: 0,
    totalStudentsCount: 0,
    totalDriversCount: 0,
    weeklyFinishedJourneysCount: 0,
    weeklyJourneysCount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await API.get("/journey/journey-summary");
      setSummaryData(response.data);
    };
    fetchData();
  }, []);

  return (
    <div className="h-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="mb-4 text-lg font-bold">Dashboard</h2>
      {summaryData ? (
        <div className="flex flex-wrap justify-between p-4 [&>*]:m-5 rounded-lg">
          <div className="w-full p-4 mb-4 bg-red-500 rounded-lg sm:w-5/12 lg:w-2/12">
            <h3 className="mb-2 text-lg font-bold text-white">
              Monthly Journeys
            </h3>
            <p className="text-3xl font-bold text-white">
              {summaryData.monthlyJourneysCount}
            </p>
          </div>
          <div className="w-full p-4 mb-4 bg-green-500 rounded-lg sm:w-5/12 lg:w-2/12">
            <h3 className="mb-2 text-lg font-bold text-white">
              Monthly Finished Journeys
            </h3>
            <p className="text-3xl font-bold text-white">
              {summaryData.monthlyFinishedJourneyCount}
            </p>
          </div>
          <div className="w-full p-4 mb-4 bg-yellow-500 rounded-lg sm:w-5/12 lg:w-2/12">
            <h3 className="mb-2 text-lg font-bold text-white">
              Total Students
            </h3>
            <p className="text-3xl font-bold text-white">
              {summaryData.totalStudentsCount}
            </p>
          </div>
          <div className="w-full p-4 mb-4 bg-purple-500 rounded-lg sm:w-5/12 lg:w-2/12">
            <h3 className="mb-2 text-lg font-bold text-white">Total Drivers</h3>
            <p className="text-3xl font-bold text-white">
              {summaryData.totalDriversCount}
            </p>
          </div>
          <div className="w-full p-4 mb-4 bg-blue-500 rounded-lg sm:w-5/12 lg:w-2/12">
            <h3 className="mb-2 text-lg font-bold text-white">
              Weekly Journeys
            </h3>
            <p className="text-3xl font-bold text-white">
              {summaryData.weeklyJourneysCount}
            </p>
          </div>
          <div className="w-full p-4 mb-4 bg-teal-500 rounded-lg sm:w-5/12 lg:w-2/12">
            <h3 className="mb-2 text-lg font-bold text-white">
              Weekly Finished Journey
            </h3>
            <p className="text-3xl font-bold text-white">
              {summaryData.weeklyFinishedJourneysCount}
            </p>
          </div>
        </div>
      ) : (
        <p>Loading summary data...</p>
      )}
    </div>
  );
};

export default Dashboard;
