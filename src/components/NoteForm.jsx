import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function NoteForm({ onSubmit, initialNote = null }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title);
      setText(initialNote.text);
    }
  }, [initialNote]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: initialNote?.id || Date.now().toString(16),
      title,
      text,
      timestamp: Date.now(),
    });
    setTitle("");
    setText("");
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
      <button
        type="submit"
        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
      >
        {initialNote ? "Update Note" : "Add Note"}
      </button>
    </motion.form>
  );
}
