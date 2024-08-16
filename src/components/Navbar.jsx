import { useState, useRef, useEffect } from "react"; // Import useRef and useEffect
import { FaSignOutAlt, FaTachometerAlt } from "react-icons/fa"; 
import { Link } from "react-router-dom"; 
import PropTypes from 'prop-types';

const NavBar = ({ user, handleLogin, handleLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to control dropdown
  const dropdownRef = useRef(null); // Ref for the dropdown menu

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    
    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <header className="fixed w-full z-20 p-4 px-12 text-white bg-[#16171C]">
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
              <div className="relative" ref={dropdownRef}> {/* Attach ref here */}
                <div className="flex items-center cursor-pointer" onClick={toggleDropdown}>
                  {user.photoURL && (
                    <img
                      src={user.photoURL}
                      alt="User Avatar"
                      className="w-10 h-10 mr-2 rounded-full"
                    />
                  )}
                  <span className="mr-2 text-white">{user.displayName}</span>
                </div>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg">
                    <div className="p-2">
                      <span className="block px-4 py-2 text-sm font-semibold">
                        {user.displayName}
                      </span>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <FaSignOutAlt className="inline mr-2" /> Logout
                      </button>
                    </div>
                  </div>
                )}
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
  );
};

NavBar.propTypes = {
  user: PropTypes.object,
  handleLogin: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default NavBar;