import { Routes, Route } from "react-router-dom";
import UnderConstruction from "./pages/UnderConstruction";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import NoteForm from "./components/NoteForm";
import NoteCard from "./components/NoteCard";
import About from "./pages/About";
import NotFound from "./pages/NotFound"; // Handle invalid routes
import { ref, onValue, push, update, remove } from "firebase/database";
import { db } from "./firebase";

function App() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const notesRef = ref(db, "saved_notes");

    try {
      const unsubscribe = onValue(
        notesRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const notesList = Object.entries(data).map(([id, note]) => ({
              id,
              ...note,
            }));
            setNotes(notesList.sort((a, b) => b.timestamp - a.timestamp));
          } else {
            setNotes([]);
          }
          setLoading(false);
        },
        (error) => {
          console.error("Firebase read error:", error);
          setError("Failed to load notes. Please try again.");
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError("Something went wrong while fetching notes.");
      setLoading(false);
    }
  }, []);

  // 🔍 Filter notes based on search query
  const filteredNotes = notes.filter(
    (note) =>
      (note.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (note.text?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (note) => {
    try {
      if (editingNote) {
        const noteRef = ref(db, `saved_notes/${note.id}`);
        await update(noteRef, {
          title: note.title.trim() || "Untitled",
          text: note.text.trim(),
          timestamp: Date.now(),
        });
        setEditingNote(null);
      } else {
        const newNote = {
          title: note.title.trim() || "Untitled",
          text: note.text.trim(),
          timestamp: Date.now(),
          user: "shanuv000",
        };
        await push(ref(db, "saved_notes"), newNote);
      }
    } catch (err) {
      console.error("Error saving note:", err);
      setError("Failed to save the note. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await remove(ref(db, `saved_notes/${id}`));
    } catch (err) {
      console.error("Error deleting note:", err);
      setError("Failed to delete the note. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="mt-16 max-w-4xl mx-auto px-4">
        <AnimatePresence mode="wait">
          <Routes>
            {/* ✅ Home Page */}
            <Route
              path="/"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-center text-gray-800 mb-6"
                  >
                    Notes App
                  </motion.h1>

                  {/* 🔍 Search Bar */}
                  <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />

                  {error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-red-500 mb-4"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Hide NoteForm when typing in search */}
                  {!searchQuery && (
                    <NoteForm
                      onSubmit={handleSubmit}
                      initialNote={editingNote}
                    />
                  )}

                  {loading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-gray-500 mt-8"
                    >
                      Loading notes...
                    </motion.div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                      <AnimatePresence>
                        {filteredNotes.length > 0 ? (
                          filteredNotes.map((note) => (
                            <NoteCard
                              key={note.id}
                              note={note}
                              onEdit={() => setEditingNote(note)}
                              onDelete={() => handleDelete(note.id)}
                            />
                          ))
                        ) : (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center text-gray-500 mt-8"
                          >
                            No notes found.
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              }
            />

            {/* ✅ About Page */}
            <Route path="/about" element={<About />} />

            {/* ✅ 404 Not Found Page */}
            <Route path="*" element={<NotFound />} />
            <Route path="/notes" element={<UnderConstruction />} />
          </Routes>
        </AnimatePresence>
      </div>
    </>
  );
}

export default App;
