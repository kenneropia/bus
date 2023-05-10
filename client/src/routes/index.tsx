import { Route, Routes } from "react-router-dom";
import RequireAuth from "../components/RequireAuth";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import RideList from "src/pages/RideList";
import RideForm from "src/pages/RideForm";
import Dashboard from "src/pages/admin/Dashboard";
import Ride from "src/pages/Ride";
import UserList from "src/pages/admin/UserList";
import { useEffect } from "react";

const Default = () => {
  useEffect(() => {
    location.assign("/landing.html");
  }, []);
  return (
    <div className="inline-flex items-center justify-center rounded-full opacity-75 bg-sky-400">
      <span className="w-20 animate-ping"></span>
    </div>
  );
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/ride"
        element={
          <RequireAuth>
            <Ride />
          </RequireAuth>
        }
      />
      <Route
        path="/users"
        element={
          <RequireAuth>
            <UserList />
          </RequireAuth>
        }
      />
      <Route
        path=""
        element={
          <RequireAuth>
            <RideList />
          </RequireAuth>
        }
      />
      <Route
        path="/rides/new"
        element={
          <RequireAuth>
            <RideForm />
          </RequireAuth>
        }
      />
      <Route
        path="/rides/:journeyId"
        element={
          <RequireAuth>
            <Ride />
          </RequireAuth>
        }
      />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Default />} />
    </Routes>
  );
};
