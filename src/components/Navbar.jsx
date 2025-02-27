import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsList, BsX } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  let lastScrollY = window.scrollY;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setIsVisible(false); // Hide on scroll down
      } else {
        setIsVisible(true); // Show on scroll up
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Notes", href: "/notes" },
    { name: "About", href: "/about" },
    { name: "Settings", href: "/settings" },
  ];

  return (
    <>
      {/* Navbar with scroll animation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
        className="bg-white shadow-md fixed w-full top-0 z-50 transition-all"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-gray-800">
              NotesApp
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Link
                    to={link.href}
                    className="text-gray-700 hover:text-blue-600 transition-all"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              {user && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  onClick={handleLogout}
                  className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-colors"
                >
                  Logout
                </motion.button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <BsX className="w-7 h-7 text-gray-800" />
              ) : (
                <BsList className="w-7 h-7 text-gray-800" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="md:hidden bg-white shadow-lg absolute top-16 left-0 w-full"
            >
              <div className="flex flex-col space-y-4 p-4">
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.href}
                    className="text-gray-700 hover:text-blue-600 text-lg transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                {user && (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="text-red-600 hover:text-red-700 text-lg transition-all text-left"
                  >
                    Logout
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Apply margin to prevent overlap with Navbar */}
      <div className="mt-20"></div>
    </>
  );
}
