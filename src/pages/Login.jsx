import React, { useContext } from 'react';
import { signInWithGoogle } from "../firebase-config";
import UserContext from '../context/UserContext';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const currentUser = await signInWithGoogle();
    if (currentUser) {
      const userData = {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL
      };
      setUser(userData);
      sessionStorage.setItem('user', JSON.stringify(userData));
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <button
        onClick={handleLogin}
        className="px-6 py-2 text-white transition duration-200 bg-blue-500 rounded hover:bg-blue-600"
      >
        Login with Google
      </button>
    </div>
  );
};

export default Login;