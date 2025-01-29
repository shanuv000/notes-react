import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import NoteForm from "./components/NoteForm";
import NoteCard from "./components/NoteCard";
import SecureLogin from "./components/passwords/SecureLogin"; // New
import { ref, onValue, push, update, remove } from "firebase/database";
import { db } from "./firebase";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false); // Hide forms when searching

  useEffect(() => {
    if (!isAuthenticated) return;

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
  }, [isAuthenticated]);

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

  if (!isAuthenticated)
    return <SecureLogin onAuthSuccess={() => setIsAuthenticated(true)} />;

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

        <SearchBar
          notes={notes}
          setFilteredNotes={setFilteredNotes}
          setIsSearching={setIsSearching}
        />

        {error && (
          <motion.div className="text-center text-red-500 mb-4">
            {error}
          </motion.div>
        )}

        <AnimatePresence>
          {!isSearching && (
            <NoteForm onSubmit={handleSubmit} initialNote={editingNote} />
          )}
        </AnimatePresence>

        {loading ? (
          <motion.div className="text-center text-gray-500 mt-8">
            Loading notes...
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <AnimatePresence>
              {filteredNotes.map((note) => (
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
      </div>
    </div>
  );
}

export default App;
