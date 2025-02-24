import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BsX, BsPlus, BsPinAngle } from "react-icons/bs";

export default function NoteForm({ onSubmit, initialNote = null }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [isPinned, setIsPinned] = useState(false);
  const [reminderDate, setReminderDate] = useState("");

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title || "");
      setText(initialNote.text || "");
      setTags(initialNote.tags || []);
      setCategory(initialNote.category || "");
      setColor(initialNote.color || "#ffffff");
      setIsPinned(initialNote.isPinned || false);
      setReminderDate(initialNote.reminderDate || "");
    }
  }, [initialNote]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() && !title.trim()) return;

    onSubmit({
      id: initialNote?.id,
      title: title.trim(),
      text: text.trim(),
      tags,
      category,
      color,
      isPinned,
      reminderDate,
      timestamp: Date.now(),
    });

    // Clear form if it's a new note
    if (!initialNote) {
      setTitle("");
      setText("");
      setTags([]);
      setCategory("");
      setColor("#ffffff");
      setIsPinned(false);
      setReminderDate("");
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const categories = [
    "Personal",
    "Work",
    "Study",
    "Shopping",
    "Ideas",
    "Other",
  ];

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6 mb-8"
      style={{ backgroundColor: color }}
    >
      <div className="mb-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded-md bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <textarea
          placeholder="Take a note..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="4"
          className="w-full px-3 py-2 border rounded-md bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Add tag"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-md bg-white/50"
          />
          <button
            onClick={handleAddTag}
            className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <BsPlus className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center gap-1"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-red-500"
              >
                <BsX className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-white/50"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <input
            type="datetime-local"
            value={reminderDate}
            onChange={(e) => setReminderDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-white/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded-md"
          />
          <span className="text-sm text-gray-600">Note Color</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPinned}
            onChange={(e) => setIsPinned(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-600">Pin Note</span>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
      >
        {initialNote ? "Update Note" : "Add Note"}
      </button>
    </motion.form>
  );
}
