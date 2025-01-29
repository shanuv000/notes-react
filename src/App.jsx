import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SecureLogin from "./components/passwords/SecureLogin"; // Secure Login
import About from "./pages/About"; // About Page
import NotesPage from "./pages/NotesPage"; // 📝 Notes Logic Moved Here
import NotFound from "./pages/NotFound"; // 404 Page

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated)
    return <SecureLogin onAuthSuccess={() => setIsAuthenticated(true)} />;

  return (
    <>
      <Navbar />
      <div className="mt-20 max-w-4xl mx-auto px-4">
        <Routes>
          {/* 🏠 Home Page (Notes) */}
          <Route path="/" element={<NotesPage />} />

          {/* 📜 Notes Page (Reusable) */}
          <Route path="/notes" element={<NotesPage />} />

          {/* ℹ️ About Page */}
          <Route path="/about" element={<About />} />

          {/* ❌ Page Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
