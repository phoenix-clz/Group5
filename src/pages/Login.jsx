import React, { useState, useEffect } from "react";
import { signInWithGoogle } from "../firebase-config";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const user = sessionStorage.getItem("user");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentUser = await signInWithGoogle();
      if (currentUser) {
        const userData = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        };
        // Store user data in session storage
        sessionStorage.setItem("user", JSON.stringify(userData));
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Welcome Back!</h1>
      {error && <p className="mb-4 text-red-500">{error}</p>}
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className={`px-6 py-2 text-white transition duration-200 bg-blue-500 rounded hover:bg-blue-600 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isLoading ? "Logging in..." : "Login with Google"}
      </button>
    </div>
  );
};

export default Login;
