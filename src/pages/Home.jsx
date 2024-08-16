import { useState, useEffect } from "react";
import { signInWithGoogle } from "../firebase-config";
import Hero from "../components/Hero";
import FeaturesSection from "../components/FeatureSection";
import Footer from "../components/Footer";
import NavBar from "../components/Navbar";

const Home = () => {
  const [user, setUser] = useState(null);

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
