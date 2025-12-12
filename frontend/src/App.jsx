import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import About from "./pages/About";
import Submit from "./pages/Submit";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { supabase } from "./lib/supabaseClient";

function ProtectedRoute({ user, children }) {
  // If no user, redirect to login
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  // Mock auth state; later replace with Supabase session
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user;

      if (sessionUser) {
        setUser({
          id: sessionUser.id,
          email: sessionUser.email,
          name: sessionUser.user_metadata?.full_name || sessionUser.email
        });
      }

      setLoadingUser(false);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const sUser = session?.user;
      if (sUser) {
        setUser({
          id: sUser.id,
          email: sUser.email,
          name: sUser.user_metadata?.full_name || sUser.email
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loadingUser) {
    return (
      <div className="flex justify-center items-center h-screen text-text-secondary">
        Loading...
      </div>
    );
  }

  async function handleLogout() {
    await supabase.auth.signOut({ scope: "local" });
    setUser(null);
  }

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="max-w-5xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/projects/:id" element={<Home user={user} />} />
          <Route path="/about" element={<About />} />

          <Route
            path="/submit"
            element={
              <ProtectedRoute user={user}>
                <Submit user={user} />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login onLogin={setUser} user={user}/>} />
          <Route path="/signup" element={<Signup onLogin={setUser} user={user}/>} />

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
