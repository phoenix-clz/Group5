import React from "react";
import { logout } from "../firebase-config";
import { useNavigate } from "react-router-dom";

export const DashNavbar = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    sessionStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div>
      <nav className="flex items-center justify-between p-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        {user && (
          <div className="flex items-center">
            <img
              src={user.photoURL}
              alt="User"
              className="w-8 h-8 mr-2 rounded-full"
            />
            <span className="mr-4">{user.displayName}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-white bg-red-500 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </div>
  );
};
