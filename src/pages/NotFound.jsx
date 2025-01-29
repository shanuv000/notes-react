import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="text-center text-gray-600 mt-10"
    >
      <h1 className="text-4xl font-bold text-red-500">404</h1>
      <p className="text-xl mt-2">Page Not Found</p>
      <Link to="/" className="text-blue-500 underline mt-4 block">
        Go to Home
      </Link>
    </motion.div>
  );
}
