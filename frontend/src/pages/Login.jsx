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

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // helper for mock fallback
  const doMockLogin = () => {
    const user = { id: "mock_user_1", name: email.split("@")[0] || "User", email };
    onLogin?.(user);
    navigate("/");
  };

  async function handleSubmit(e) {
    e?.preventDefault();
    setError("");
    if (!email || !password) return setError("Please provide email and password.");

    if (!supabase) {
      // mock flow for local testing
      doMockLogin();
      return;
    }

    setLoading(true);
    try {
      const { data, error: authErr } = await supabase.auth.signInWithPassword({ email, password });
      if (authErr) throw authErr;
      const user = data.user;
      onLogin?.({ id: user.id, email: user.email, name: user.user_metadata?.full_name || user.email });
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleOAuth(provider) {
    if (!supabase) {
      // mock oauth
      onLogin?.({ id: `mock_${provider}`, name: provider, email: `${provider}@example.com` });
      navigate("/");
      return;
    }
    setLoading(true);
    try {
      // redirect mode
      const { error: oauthErr } = await supabase.auth.signInWithOAuth({ provider });
      if (oauthErr) setError(oauthErr.message);
      // note: signInWithOAuth will redirect — post-login handled by App auth listener
    } catch (err) {
      setError(err.message || "OAuth failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-2xl font-semibold text-text-primary mb-2">Login</h1>
      <p className="text-text-secondary mb-6">Sign in to submit, comment, and upvote projects.</p>

      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm text-text-primary">Email</label>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email"
            className="w-full px-3 py-2 rounded-md bg-background border border-border text-text-primary" />

          <label className="block text-sm text-text-primary">Password</label>
          <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password"
            className="w-full px-3 py-2 rounded-md bg-background border border-border text-text-primary" />

          {error && <div className="text-xs text-red-400">{error}</div>}

          <div className="flex items-center gap-3">
            <button type="submit" disabled={loading}
              className="px-4 py-2 rounded-md bg-accent text-white">
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <button type="button" onClick={() => { setEmail(""); setPassword(""); }}
              className="px-3 py-2 rounded-md bg-background-softer border border-border text-text-primary">
              Reset
            </button>

            <div className="ml-auto text-xs text-text-secondary">
              <a href="/signup" className="underline">Create account</a>
            </div>
          </div>
        </form>

        <div className="border-t border-border pt-4">
          <div className="text-xs text-text-secondary mb-2">Or continue with</div>
          <div className="flex gap-3">
            <button onClick={() => handleOAuth("github")} className="flex-1 px-3 py-2 rounded-md bg-background border border-border">GitHub</button>
            <button onClick={() => handleOAuth("google")} className="flex-1 px-3 py-2 rounded-md bg-background border border-border">Google</button>
          </div>
          {!supabase && <div className="text-xs text-text-secondary mt-2">(Using mock OAuth locally)</div>}
        </div>
      </div>
    </div>
  );
}
