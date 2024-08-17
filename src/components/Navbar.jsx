import { useState, useRef, useEffect } from "react";
import { FaSignOutAlt, FaTachometerAlt, FaBars, FaTimes, FaCalculator } from "react-icons/fa";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const NavBar = ({ user, handleLogin, handleLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <header className="fixed w-full z-20 p-4 px-12 text-white bg-[#16171C]">
      <nav className="flex items-center justify-between">
        <div className="text-2xl font-bold">
          <Link to="/">Smart Paisa</Link>
        </div>
        <div className="flex items-center md:hidden">
          <button onClick={toggleMenu} className="text-white">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        <div className={`hidden items-center md:flex ${menuOpen ? 'block' : 'hidden'} md:block`}>
          <Link to="/calculator" className="px-4 flex  items-center text-md">
          <FaCalculator className="mr-2"/>  Calculator
          </Link>
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center mr-4 text-white transition-colors hover:text-gray-300"
              >
                <FaTachometerAlt className="mr-2" />
                Dashboard
              </Link>
              <div className="relative" ref={dropdownRef}>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={toggleDropdown}
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="User Avatar"
                      className="w-10 h-10 mr-2 rounded-full"
                    />
                  ) : (
                    <span className="w-10 h-10 mr-2 rounded-full bg-gray-400 flex items-center justify-center">
                      {/* {user.displayName[0]} */}
                    </span>
                  )}
                </div>
                {dropdownOpen && (
                  <div className="absolute right-0 w-48 mt-2 text-black bg-white rounded-lg shadow-lg">
                    <div className="p-2">
                      <span className="block px-4 py-2 text-sm font-semibold">
                        {user.displayName}
                      </span>
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
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
                src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-1024.png"
                alt="Google Icon"
                className="w-5 h-5 mr-2"
              />
              Login with Google
            </button>
          )}
        </div>
      </nav>
      {menuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-[#16171C] py-2 md:hidden">
          <Link to="/calculator" className="block px-4 py-2 text-md text-white">
            Calculator
          </Link>
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="block px-4 py-2 text-md text-white"
              >
                Dashboard
              </Link>
              <div className="relative mt-2" ref={dropdownRef}>
              <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
                      >
                        <FaSignOutAlt className="inline mr-2" /> Logout
                      </button>
                
              </div>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className=" items-center block w-full px-4 py-2 text-white bg-blue-500 rounded"
            >
              <img
                src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-1024.png"
                alt="Google Icon"
                className="w-5 h-5 mr-2"
              />
              Login with Google
            </button>
          )}
        </div>
      )}
    </header>
  );
};

NavBar.propTypes = {
  user: PropTypes.object,
  handleLogin: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default NavBar;