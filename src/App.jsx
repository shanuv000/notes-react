import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import AuthPage from "./components/AuthPage";
import NotesPage from "./pages/NotesPage";
import About from "./pages/About";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <div className="mt-20 max-w-4xl mx-auto px-4">
                  <NotesPage />
                </div>
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <div className="mt-20 max-w-4xl mx-auto px-4">
                  <NotesPage />
                </div>
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <div className="mt-20 max-w-4xl mx-auto px-4">
                  <Settings />
                </div>
              </>
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
