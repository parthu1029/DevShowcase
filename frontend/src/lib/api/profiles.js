import { supabase } from "../supabaseClient";

export async function getProfile(username) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Profile not found");
  return data;
}

export async function updateProfile(updates) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not logged in");

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMyProfile() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not logged in");

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) throw error;
  return data;
}

export async function ensureMyProfile() {
  const auth = await supabase.auth.getUser();
  const user = auth?.data?.user;
  if (!user) throw new Error("Not logged in");

  // Check if profile exists
  const { data: rows, error: selErr } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("id", user.id)
    .limit(1);
  if (selErr) throw selErr;
  if (rows && rows.length) return rows[0];

  // Generate a candidate username
  const raw = (
    user.user_metadata?.username ||
    user.user_metadata?.preferred_username ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "user"
  ).toLowerCase();
  const base = raw.replace(/[^a-z0-9_\-\.]/g, "").slice(0, 24) || `user_${user.id.slice(0,6)}`;
  let candidate = base;

  for (let i = 0; i < 5; i++) {
    const { data: conflict, error: cErr } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", candidate)
      .limit(1);
    if (cErr) throw cErr;
    if (!conflict || conflict.length === 0) {
      const { data, error: insErr } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          username: candidate,
          full_name: user.user_metadata?.full_name ?? null,
          avatar_url: user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null,
        })
        .select("id, username")
        .single();
      if (insErr) throw insErr;
      return data;
    }
    candidate = `${base}${Math.floor(Math.random() * 1000)}`.slice(0, 28);
  }

  throw new Error("Unable to create profile");
}
