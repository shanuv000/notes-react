import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import NoteForm from "./components/NoteForm";
import NoteCard from "./components/NoteCard";
import { ref, onValue, push, update, remove } from "firebase/database";
import { db } from "./firebase";

function App() {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false); // Track search activity

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
            setFilteredNotes(notesList);
          } else {
            setNotes([]);
            setFilteredNotes([]);
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
    <div className="min-h-screen bg-gray-50 py-8">
      <Navbar />
      <div className="mt-16 max-w-4xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center text-gray-800 mb-6"
        >
          Notes App
        </motion.h1>

        {/* 🔍 Optimized SearchBar */}
        <SearchBar
          notes={notes}
          setFilteredNotes={setFilteredNotes}
          setIsSearching={setIsSearching} // Track search state
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

        {/* ✅ Hide NoteForm when searching */}
        <AnimatePresence>
          {!isSearching && (
            <motion.div
              key="noteForm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <NoteForm onSubmit={handleSubmit} initialNote={editingNote} />
            </motion.div>
          )}
        </AnimatePresence>

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
      </div>
    </div>
  );
}

export default App;
