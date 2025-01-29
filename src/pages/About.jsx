import { motion } from "framer-motion";

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-6 py-12 text-center"
    >
      <h1 className="text-4xl font-bold text-gray-800 mb-6">About NotesApp</h1>
      <p className="text-lg text-gray-600">
        Welcome to <span className="font-semibold text-blue-600">NotesApp</span>{" "}
        – a simple yet powerful way to save and organize your notes.
      </p>
      <p className="mt-4 text-gray-600">
        This project is built with{" "}
        <span className="font-semibold">
          Vite, React, Firebase, Tailwind CSS, and Framer Motion
        </span>{" "}
        to ensure a fast and smooth user experience.
      </p>
      <p className="mt-4 text-gray-600">
        Our goal is to provide an easy-to-use platform for taking, saving, and
        managing your notes across devices.
      </p>
      <p className="mt-6 text-gray-600">
        Made with ❤️ by{" "}
        <span className="font-semibold text-blue-600">Your Name</span>
      </p>
    </motion.div>
  );
}
