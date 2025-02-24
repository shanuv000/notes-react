import { useState, useEffect } from "react";
import Fuse from "fuse.js";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function SearchBar({ notes, setFilteredNotes, setIsSearching }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("all"); // title, content, tags

  const fuse = new Fuse(notes, {
    keys: [
      { name: "title", weight: 0.4 },
      { name: "text", weight: 0.3 },
      { name: "tags", weight: 0.2 },
      { name: "category", weight: 0.1 },
    ],
    threshold: 0.3,
    includeScore: true,
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
    <div className="flex gap-2 mb-6">
      <input
        type="text"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1 pl-10 pr-12 py-2 border rounded-md"
      />
      <select
        value={searchBy}
        onChange={(e) => setSearchBy(e.target.value)}
        className="px-4 py-2 border rounded-md"
      >
        <option value="all">All</option>
        <option value="title">Title</option>
        <option value="content">Content</option>
        <option value="tags">Tags</option>
      </select>
    </div>
  );
}
