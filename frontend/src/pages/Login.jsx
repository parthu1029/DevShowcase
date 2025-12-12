import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";

// try to import supabase client if available
let supabase = null;

(async () => {
  try {
    const module = await import("../lib/supabaseClient");
    supabase = module.supabase;
  } catch (e) {
    supabase = null;
  }
})();

export default function Login({ onLogin, user }) {
  const navigate = useNavigate();

  // redirect logged-in users
  useEffect(() => {
  if (user) navigate("/dashboard");
}, [user, navigate]);


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 1800);
  }

  const mockLogin = () => {
    const u = { id: "mock1", email, name: email.split("@")[0] };
    onLogin?.(u);
    showToast("Logged in successfully!");
    setTimeout(() => navigate("/dashboard"), 500);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return showToast("Email and password required", "error");

    if (!supabase) return mockLogin();

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;

      const user = data.user;
      onLogin({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email,
      });

      showToast("Welcome back! ");
      setTimeout(() => navigate("/dashboard"), 600);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleOAuth(provider) {
    if (!supabase) {
      showToast("Mock OAuth login", "success");
      return mockLogin();
    }
    await supabase.auth.signInWithOAuth({ provider });
  }

  return (
    <div className="flex justify-center pt-20">
      {toast && <Toast message={toast.msg} type={toast.type} />}

      <div className="w-full max-w-md bg-background-softer/60 border border-border rounded-xl p-8 shadow-xl backdrop-blur-md">
        <h1 className="text-2xl font-semibold text-text-primary mb-2">Welcome Back</h1>
        <p className="text-text-secondary mb-6">Login to continue</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-background border border-border text-text-primary"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-background border border-border text-text-primary"
          />

          <button
            className="w-full py-2 rounded-md bg-accent text-white font-medium hover:bg-accent/90"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center text-sm text-text-secondary mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-accent underline">Sign up</a>
        </div>

        <div className="border-t border-border mt-6 pt-4">
          <div className="text-center text-xs text-text-secondary mb-3">Or continue with</div>

          <div className="flex gap-3">
            <button
              onClick={() => handleOAuth("github")}
              className="flex-1 py-2 rounded-md bg-background border border-border hover:bg-background-softer"
            >
              GitHub
            </button>

            <button
              onClick={() => handleOAuth("google")}
              className="flex-1 py-2 rounded-md bg-background border border-border hover:bg-background-softer"
            >
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
