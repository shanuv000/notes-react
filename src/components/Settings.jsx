export default function Settings({ user }) {
  const handleExport = async () => {
    const notesRef = ref(db, `notes/${user.uid}`);
    const snapshot = await get(notesRef);
    const notes = snapshot.val();

    const blob = new Blob([JSON.stringify(notes)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "notes-backup.json";
    a.click();
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const notes = JSON.parse(e.target.result);
      await set(ref(db, `notes/${user.uid}`), notes);
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      <div className="space-y-4">
        <button
          onClick={handleExport}
          className="bg-primary text-white px-4 py-2 rounded-md"
        >
          Export Notes
        </button>

        <div>
          <label className="block mb-2">Import Notes</label>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="block w-full text-sm"
          />
        </div>
      </div>
    </div>
  );
}
