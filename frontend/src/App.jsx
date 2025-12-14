import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import About from "./pages/About";
import Submit from "./pages/Submit";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { supabase } from "./lib/supabaseClient";

function ProtectedRoute({ user, children }) {
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user;

      if (sessionUser) {
        setUser({
          id: sessionUser.id,
          email: sessionUser.email,
          name: sessionUser.user_metadata?.full_name || sessionUser.email,
        });
      }

      setLoadingUser(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const sUser = session?.user;
      if (sUser) {
        setUser({
          id: sUser.id,
          email: sUser.email,
          name: sUser.user_metadata?.full_name || sUser.email,
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (logoutLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-text-secondary text-lg">
        Logging out…
      </div>
    );
  }

  if (loadingUser) {
    return (
      <div className="flex justify-center items-center h-screen text-text-secondary">
        Loading...
      </div>
    );
  }

   async function handleLogout() {
    setLogoutLoading(true);

    try {
      await supabase.auth.signOut({ scope: "local" });
      setUser(null);
      navigate("/explore", { replace: true });
    } catch (err) {
      console.error("Logout Error:", err);
    } finally {
      setLogoutLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="max-w-5xl mx-auto p-6">
        <Routes>
          {/* Home + Project Modal */}
          <Route path="/" element={user ? <Home user={user} /> : <Navigate to="/about" replace />} />
          <Route path="/home" element={user ? <Home user={user} /> : <Navigate to="/login" replace />}/>
          <Route path="/projects/:id" element={<Home user={user} />} />

          {/* Basic pages */}
          <Route path="/about" element={<About />} />
          <Route path="/explore" element={<Explore user={user} />} />

          {/* Auth pages */}
          <Route path="/login" element={<Login onLogin={setUser} user={user} />} />
          <Route path="/signup" element={<Signup onLogin={setUser} user={user} />} />

          {/* Protected Submit Route */}
          <Route
            path="/submit"
            element={
              <ProtectedRoute user={user}>
                <Submit user={user} />
              </ProtectedRoute>
            }
          />

          <Route path="/profile/:username" element={<Profile user={user} />} />
          <Route path="/profile" element={<Navigate to={`/profile/${user?.name}`} replace />} />

          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
