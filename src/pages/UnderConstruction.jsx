import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function UnderConstruction() {
  return (
    <div className="mt-16 min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800">
      {/* 🚧 Animated Construction SVG */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, duration: 1.5 }}
        className="mb-6"
      >
        <img
          src="/construction.svg"
          alt="Under Construction"
          className="w-64 sm:w-80"
        />
      </motion.div>

      {/* 🏗️ Animated Text */}
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="text-4xl font-bold text-center"
      >
        🚧 Page Under Construction 🚧
      </motion.h1>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-lg text-gray-600 mt-4 text-center"
      >
        We're working hard to bring something amazing! Stay tuned.
      </motion.p>

      {/* 🏠 Back Home Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-6"
      >
        <Link
          to="/"
          className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all"
        >
          🔙 Go Back Home
        </Link>
      </motion.div>
    </div>
  );
}
