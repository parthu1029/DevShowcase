import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

export default function Signup({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const doMockSignup = () => {
    const user = { id: "mock_user_2", name: name || email.split("@")[0], email };
    onLogin?.(user);
    navigate("/");
  };

  async function handleSubmit(e) {
    e?.preventDefault();
    setError("");
    if (!email || !password) return setError("Please provide email and password.");
    if (!supabase) {
      doMockSignup();
      return;
    }

    setLoading(true);
    try {
      const { data, error: signErr } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      });
      if (signErr) throw signErr;
      // Supabase will typically send confirmation email depending on settings
      const user = data.user;
      onLogin?.({ id: user.id, email: user.email, name: user.user_metadata?.full_name || user.email });
      navigate("/");
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-2xl font-semibold text-text-primary mb-2">Create account</h1>
      <p className="text-text-secondary mb-6">Create an account to submit projects and interact.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm text-text-primary">Full name</label>
        <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full px-3 py-2 rounded-md bg-background border border-border text-text-primary" />

        <label className="block text-sm text-text-primary">Email</label>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className="w-full px-3 py-2 rounded-md bg-background border border-border text-text-primary" />

        <label className="block text-sm text-text-primary">Password</label>
        <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" className="w-full px-3 py-2 rounded-md bg-background border border-border text-text-primary" />

        {error && <div className="text-xs text-red-400">{error}</div>}

        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className="px-4 py-2 rounded-md bg-accent text-white">
            {loading ? "Creating..." : "Create account"}
          </button>

          <div className="ml-auto text-xs text-text-secondary">
            <a href="/login" className="underline">Sign in</a>
          </div>
        </div>
      </form>
    </div>
  );
}
