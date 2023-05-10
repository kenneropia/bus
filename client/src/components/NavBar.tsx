import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Navbar() {
  const { getUser, logout } = useAuth();

  const navigate = useNavigate();
  return (
    <nav className="py-4 bg-gray-200">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center md:flex-row md:justify-between">
          <div className="inline-flex w-full md:w-2/12">
            <a
              href="/landing.html"
              className="text-2xl font-bold text-blue-700"
            >
              Rider
            </a>
          </div>
          <div className="flex items-baseline justify-center px-2 mt-2 space-x-4 sm:px-0 md:mt-0 md:justify-end md:w-full md:flex md:ml-10">
            {getUser()?.role !== "admin" && (
              <>
                <Link
                  to="/ride"
                  className="px-3 py-2 text-sm font-medium text-blue-700"
                >
                  View Current Ride
                </Link>
              </>
            )}

            <Link
              to="/"
              className="px-3 py-2 text-sm font-medium text-blue-700"
            >
              View Rides
            </Link>

            {getUser()?.role == "student" && (
              <>
                <Link
                  to="/rides/new"
                  className="px-3 py-2 text-sm font-medium text-blue-700"
                >
                  Book Ride
                </Link>
              </>
            )}
            {!getUser() && (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-medium text-blue-700"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-2 text-sm font-medium text-blue-700"
                >
                  Signup
                </Link>
              </>
            )}
            {getUser()?.role == "admin" && (
              <>
                <Link
                  to="/dashboard"
                  className="px-3 py-2 text-sm font-medium text-blue-700"
                >
                  Dashboard
                </Link>
                <Link
                  to="/users"
                  className="px-3 py-2 text-sm font-medium text-blue-700"
                >
                  Users
                </Link>
              </>
            )}
            {getUser() && (
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="px-3 py-2 text-sm font-medium text-blue-700"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
