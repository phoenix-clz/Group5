import React from "react";
import { logout } from "../firebase-config";
import { useNavigate } from "react-router-dom";

export const DashNavbar = ({ onMenuClick }) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    sessionStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="px-4 mx-auto w-full sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
          <div className="flex items-center ml-auto"> {/* Use ml-auto to push this container to the right */}
            {user && (
              <>
                <img
                  src={user.photoURL}
                  alt="User"
                  className="w-8 h-8 mr-2 rounded-full"
                />
                <span className="hidden mr-4 md:inline">{user.displayName}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-white bg-red-500 rounded"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};