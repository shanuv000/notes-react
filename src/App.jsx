import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import NoteForm from "./components/NoteForm";
import NoteCard from "./components/NoteCard";
import About from "./pages/About";
import { useState, useEffect } from "react";
import { ref, onValue, push, update, remove } from "firebase/database";
import { db } from "./firebase";

function App() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // ✅ FIX: Add handleSubmit function
  const handleSubmit = async (note) => {
    try {
      if (editingNote) {
        // Update existing note
        const noteRef = ref(db, `saved_notes/${note.id}`);
        await update(noteRef, {
          title: note.title.trim() || "Untitled",
          text: note.text.trim(),
          timestamp: Date.now(),
        });
        setEditingNote(null);
      } else {
        // Add a new note
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

  // ✅ FIX: Add handleDelete function
  const handleDelete = async (id) => {
    try {
      await remove(ref(db, `saved_notes/${id}`));
    } catch (err) {
      console.error("Error deleting note:", err);
      setError("Failed to delete the note. Please try again.");
    }
  };

  return (
    <Router>
      <Navbar />
      <div className="mt-16 p-4">
        <AnimatePresence mode="wait">
          <Routes>
            {/* Home Page */}
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
                    className="text-3xl font-bold text-center text-gray-800 mb-8"
                  >
                    Notes App
                  </motion.h1>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-red-500 mb-4"
                    >
                      {error}
                    </motion.div>
                  )}

                  <NoteForm onSubmit={handleSubmit} initialNote={editingNote} />

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
                        {notes.map((note) => (
                          <NoteCard
                            key={note.id}
                            note={note}
                            onEdit={() => setEditingNote(note)}
                            onDelete={() => handleDelete(note.id)}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  )}

                  {!loading && notes.length === 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-gray-500 mt-8"
                    >
                      No notes yet. Create one to get started!
                    </motion.p>
                  )}
                </motion.div>
              }
            />

            {/* About Page */}
            <Route path="/about" element={<About />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
