import { useState, useEffect } from "react";
import { signInWithGoogle } from "../firebase-config";
import NavBar from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturesSection from "../components/FeatureSection";
import Footer from "../components/Footer";
import { FaSignOutAlt, FaTachometerAlt } from "react-icons/fa"; // Added dashboard icon
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate


const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Hook for programmatic navigation

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = async () => {
    try {
      const currentUser = await signInWithGoogle();
      if (currentUser) {
        const userData = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        };
        sessionStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        navigate("/dashboard"); // Redirect to dashboard after login
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setUser(null);

    navigate("/"); // Redirect to home page after logout
  };

  return (
    <div className="font-sans">
      {/* NavBar */}
      <header className="fixed w-full p-4 text-white bg-red-800">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold">Smart Paisa</div>
          <div className="flex items-center">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center mr-4 text-white transition-colors hover:text-gray-300"
                >
                  <FaTachometerAlt className="mr-2" />
                  Dashboard
                </Link>
                <div className="flex items-center">
                  {user.photoURL && (
                    <img
                      src={user.photoURL}
                      alt="User Avatar"
                      className="w-10 h-10 mr-2 rounded-full"
                    />
                  )}
                  <span className="mr-2 text-white">{user.displayName}</span>
                  <button
                    onClick={handleLogout}
                    className="text-white transition-colors hover:text-gray-300"
                    title="Logout"
                  >
                    <FaSignOutAlt size={20} />
                  </button>
                </div>
              </>
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
          </div>
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

  return (
    <div className="font-sans w-full">
      <NavBar user={user} handleLogin={handleLogin} handleLogout={handleLogout} />
      <Hero handleLogin={handleLogin} />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Home;