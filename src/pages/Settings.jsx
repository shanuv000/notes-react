import { ref, get, set } from "firebase/database";
import { db } from "../firebase";
import { motion } from "framer-motion";

export default function Settings({ user }) {
  const handleExport = async () => {
    const notesRef = ref(db, `notes/${user.uid}`);
    const snapshot = await get(notesRef);
    const notes = snapshot.val();

    const blob = new Blob([JSON.stringify(notes, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `notes-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const notes = JSON.parse(e.target.result);
          await set(ref(db, `notes/${user.uid}`), notes);
          alert("Notes imported successfully!");
        } catch (error) {
          console.error("Error parsing JSON:", error);
          alert("Error importing notes. Please check the file format.");
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error("Error importing notes:", error);
      alert("Error importing notes. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl mx-auto p-6"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

      <div className="space-y-6">
        {/* Data Management Section */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Management</h2>
          
          {/* Export Notes */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Export Notes</h3>
            <p className="text-gray-600 mb-3">
              Download all your notes as a JSON file for backup.
            </p>
            <button
              onClick={handleExport}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Export Notes
            </button>
          </div>

          {/* Import Notes */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Import Notes</h3>
            <p className="text-gray-600 mb-3">
              Import notes from a previously exported JSON file.
            </p>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                cursor-pointer"
            />
          </div>
        </section>

        {/* User Info Section */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h2>
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">User ID:</span> {user.uid}
            </p>
          </div>
        </section>
      </div>
    </motion.div>
  );
}