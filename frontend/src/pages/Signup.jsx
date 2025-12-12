import React, { useState } from "react";
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

export default function Signup({ onLogin, user }) {
  const navigate = useNavigate();

  if (user) navigate("/dashboard");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 1800);
  }

  const mockSignup = () => {
    const u = { id: "mock2", name, email };
    onLogin?.(u);
    showToast("Account created!");
    setTimeout(() => navigate("/dashboard"), 500);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name || !email || !password)
      return showToast("All fields required", "error");

    if (!supabase) return mockSignup();

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      });

      if (error) throw error;

      const user = data.user;

      onLogin({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email,
      });

      showToast("Account created!");
      setTimeout(() => navigate("/dashboard"), 600);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center pt-20">
      {toast && <Toast message={toast.msg} type={toast.type} />}

      <div className="w-full max-w-md bg-background-softer/60 border border-border rounded-xl p-8 shadow-xl backdrop-blur-md">
        <h1 className="text-2xl font-semibold text-text-primary mb-2">Create Account</h1>
        <p className="text-text-secondary mb-6">Join the DevShowcase community</p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-background border border-border text-text-primary"
          />

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
            disabled={loading}
            className="w-full py-2 rounded-md bg-accent text-white font-medium hover:bg-accent/90"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center text-sm text-text-secondary mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-accent underline">Login</a>
        </div>
      </div>
    </div>
  );
}
