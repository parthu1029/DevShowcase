import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import About from "./pages/About";
import Submit from "./pages/Submit";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

function ProtectedRoute({ user, children }) {
  // If no user, redirect to login
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  // Mock auth state; later replace with Supabase session
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => setUser(null);

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} />

      <main className="max-w-5xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />

          <Route
            path="/submit"
            element={
              <ProtectedRoute user={user}>
                <Submit user={user} />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup onLogin={handleLogin} />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user}>
                <Dashboard user={user} />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
