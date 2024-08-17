import { useState, useEffect } from "react";
import { signInWithGoogle } from "../firebase-config";
import Hero from "../components/Hero";
import FeaturesSection from "../components/FeatureSection";
import Footer from "../components/Footer";
import NavBar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = async () => {
    try {
      //get logged user from session
      const currentUser = JSON.parse(sessionStorage.getItem("user"));
      if (currentUser) {
        //redirect to dashboard
        setUser(currentUser);
        navigate("/dashboard");
      } else {
        //redirect to login page
        navigate("/login");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    // navigate("/"); // Uncomment if needed with useNavigate hook
  };

  return (
    <div className="w-full font-sans">
      <NavBar
        user={user}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
      />
      <Hero handleLogin={handleLogin} />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Home;
