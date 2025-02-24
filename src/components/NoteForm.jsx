import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function NoteForm({ onSubmit, initialNote = null }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tags, setTags] = useState([]);
  const [color, setColor] = useState("#ffffff");
  const [isPinned, setIsPinned] = useState(false);
  const [reminderDate, setReminderDate] = useState(null);

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title);
      setText(initialNote.text);
      setTags(initialNote.tags || []);
      setColor(initialNote.color || "#ffffff");
      setIsPinned(initialNote.isPinned || false);
      setReminderDate(initialNote.reminderDate || null);
    }
  }, [initialNote]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: initialNote?.id || Date.now().toString(16),
      title,
      text,
      timestamp: Date.now(),
      tags,
      color,
      isPinned,
      reminderDate,
    });
    setTitle("");
    setText("");
    setTags([]);
    setColor("#ffffff");
    setIsPinned(false);
    setReminderDate(null);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-md mb-6"
      onSubmit={handleSubmit}
    >
      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="text"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Content
        </label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          rows="4"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <input
          type="text"
          placeholder="Add tags (comma separated)"
          onChange={(e) =>
            setTags(e.target.value.split(",").map((tag) => tag.trim()))
          }
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Note Color
        </label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full h-10 rounded-md"
        />
      </div>
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          checked={isPinned}
          onChange={(e) => setIsPinned(e.target.checked)}
          className="mr-2"
        />
        <label className="text-sm font-medium text-gray-700">
          Pin this note
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Set Reminder
        </label>
        <input
          type="datetime-local"
          onChange={(e) => setReminderDate(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
      >
        {initialNote ? "Update Note" : "Add Note"}
      </button>
    </motion.form>
  );
}
