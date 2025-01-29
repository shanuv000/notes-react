import { motion } from "framer-motion";
import { format } from "date-fns";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";

// Function to check if text is a URL
const isValidURL = (text) => {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ipv4
      "(\\:\\d+)?(\\/[-a-zA-Z\\d%@_.~+&:]*)*" + // port and path
      "(\\?[;&a-zA-Z\\d%@_.,~+&:=-]*)?" + // query string
      "(\\#[-a-zA-Z\\d_]*)?$", // fragment locator
    "i"
  );
  return urlPattern.test(text);
};

export default function NoteCard({ note, onEdit, onDelete }) {
  if (!note || !note.id) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
      >
        <p className="text-gray-600">Invalid note data</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
    >
      {/* Title and Buttons */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800 break-words w-4/5">
          {note.title || "Untitled"}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(note)}
            className="p-2 text-gray-600 hover:text-primary rounded-full hover:bg-gray-100"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-2 text-gray-600 hover:text-red-500 rounded-full hover:bg-gray-100"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Note Content (Check for URL) */}
      <div className="text-gray-600 mb-4 break-words w-full">
        {note.text ? (
          isValidURL(note.text) ? (
            <a
              href={note.text}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline break-all"
            >
              {note.text}
            </a>
          ) : (
            note.text
          )
        ) : (
          "No content available"
        )}
      </div>

      {/* Timestamp */}
      <div className="text-sm text-gray-400">
        {note.timestamp
          ? format(new Date(note.timestamp), "MMM dd, yyyy")
          : "No date available"}
      </div>
    </motion.div>
  );
}
