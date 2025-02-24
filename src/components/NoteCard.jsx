import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  BsTrash,
  BsPencil,
  BsClipboard,
  BsCheck2,
  BsPinAngle,
  BsBell,
} from "react-icons/bs";

export default function NoteCard({ note, onEdit, onDelete }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(note.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isValidURL = (text) => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  };

  const hasReminder =
    note.reminderDate && new Date(note.reminderDate) > new Date();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative rounded-lg shadow-md hover:shadow-lg transition-shadow"
      style={{ backgroundColor: note.color || "#ffffff" }}
    >
      {note.isPinned && (
        <BsPinAngle className="absolute top-2 right-2 w-5 h-5 text-blue-500" />
      )}

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {note.title || "Untitled"}
            </h3>
            {note.category && (
              <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {note.category}
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            {hasReminder && (
              <BsBell
                className="w-5 h-5 text-blue-500"
                title={`Reminder: ${format(
                  new Date(note.reminderDate),
                  "PPp"
                )}`}
              />
            )}
            <button
              onClick={handleCopy}
              className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100"
              title="Copy note"
            >
              {copied ? (
                <BsCheck2 className="w-5 h-5 text-green-500" />
              ) : (
                <BsClipboard className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => onEdit(note)}
              className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100"
              title="Edit note"
            >
              <BsPencil className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(note.id)}
              className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-gray-100"
              title="Delete note"
            >
              <BsTrash className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="text-gray-600 mb-4">
          {isValidURL(note.text) ? (
            <a
              href={note.text}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {note.text}
            </a>
          ) : (
            <p className="whitespace-pre-wrap">{note.text}</p>
          )}
        </div>

        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {note.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="text-sm text-gray-500">
          {format(note.timestamp, "PPp")}
        </div>
      </div>
    </motion.div>
  );
}
