import React, { useContext } from 'react';
import { logout } from '../firebase-config';
import UserContext from '../context/UserContext';

const Dashboard = () => {
  const { user, setUser } = useContext(UserContext);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    sessionStorage.removeItem('user');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {user ? (
        <>
          <h1 className="mb-4 text-3xl">Welcome, {user.displayName}!</h1>
          <button
            onClick={handleLogout}
            className="px-6 py-2 text-white transition duration-200 bg-red-500 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </>
      ) : (
        <h2 className="text-xl">Please log in.</h2>
      )}
    </div>
  );
};

export default Dashboard;