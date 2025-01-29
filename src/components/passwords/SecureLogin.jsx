import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PasswordInput from "./PasswordInput"; // 8-digit PIN UI Component

export default function SecureLogin({ onAuthSuccess }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check localStorage for existing login session
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
      onAuthSuccess();
    }
  }, []);

  const handleLogin = (enteredPin) => {
    const storedHash = "20111996"; // Example hashed PIN (replace with Firebase-stored hash)
    if (enteredPin === storedHash) {
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
      onAuthSuccess();
    } else {
      alert("Invalid PIN. Access Denied!");
    }
  };

  return isAuthenticated ? null : (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-4"
      >
        🔒 Secure Login
      </motion.h1>
      <PasswordInput onSubmit={handleLogin} />
    </div>
  );
}
