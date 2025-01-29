import { useState, useEffect } from "react";
import Fuse from "fuse.js";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function SearchBar({ notes, setFilteredNotes, setIsSearching }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize Fuse.js for fuzzy searching
  const fuse = new Fuse(notes, {
    keys: ["title", "text"], // Fields to search within
    threshold: 0.3, // Sensitivity of search (lower = stricter matches)
    includeScore: true, // Show score of matches
  });

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredNotes(notes);
      setIsSearching(false); // Show form when no search
      return;
    }

    setIsSearching(true); // Hide form when searching

    const results = fuse.search(searchQuery);
    const matchedNotes = results.map((result) => result.item);
    setFilteredNotes(matchedNotes);
  }, [searchQuery, notes]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mb-6 flex items-center w-full"
    >
      {/* Search Icon */}
      <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 text-gray-400" />

      {/* Input Field */}
      <input
        type="text"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />

      {/* Clear Button */}
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="absolute right-3 text-gray-500 hover:text-red-500 transition-all"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      )}
    </motion.div>
  );
}
