import React, { useContext } from "react";
import { signInWithGoogle } from "../firebase-config";
import UserContext from "../context/UserContext";

const Home = () => {
  const { user, setUser } = useContext(UserContext);
  console.log('user: ', user);

  const handleLogin = async () => {
    const loggedInUser = await signInWithGoogle();
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  };

  return (
    <div className="font-sans">
      {/* NavBar */}
      <header className="fixed w-full p-4 text-white bg-red-800">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold">Financial Literacy</div>
          {user ? (
            <div className="flex items-center">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt="User Avatar"
                  className="w-10 h-10 mr-2 rounded-full"
                />
              )}
              <span className="text-white">{user.displayName}</span>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="flex items-center px-4 py-2 text-white bg-blue-500 rounded"
            >
              <img
                src="https://static-00.iconduck.com/assets.00/google-icon-2048x2048-pks9lbdv.png"
                alt="Google Icon"
                className="w-5 h-5 mr-2"
              />
              Login with Google
            </button>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center h-screen pt-20 bg-blue-200">
        <h1 className="text-5xl font-extrabold text-blue-800">
          Take Control of Your Finances
        </h1>
        <p className="mt-4 text-xl text-blue-600">
          Gather, analyze, and maximize your wealth.
          <br />
          Join us to start your financial journey!
        </p>
        <button
          onClick={handleLogin}
          className="px-6 py-2 mt-6 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Get Started
        </button>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-100">
        <div className="container px-4 mx-auto">
          <h2 className="mb-10 text-3xl font-bold text-center">Our Features</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="p-6 text-center bg-white rounded-lg shadow-md">
              <h3 className="mb-4 text-2xl font-semibold">
                Personal Finance Management
              </h3>
              <p className="text-gray-700">
                Store and track all your financial information in one place,
                from bank accounts to investments.
              </p>
            </div>
            <div className="p-6 text-center bg-white rounded-lg shadow-md">
              <h3 className="mb-4 text-2xl font-semibold">Data Analysis</h3>
              <p className="text-gray-700">
                Analyze your spending habits, investment opportunities, and
                receive personalized recommendations.
              </p>
            </div>
            <div className="p-6 text-center bg-white rounded-lg shadow-md">
              <h3 className="mb-4 text-2xl font-semibold">Monthly Reports</h3>
              <p className="text-gray-700">
                Receive monthly and annual financial reports to keep you
                informed and on track.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
