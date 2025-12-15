import { supabase } from "../supabaseClient";

export async function getProfile(username) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(updates) {
  const user = (await supabase.auth.getUser()).data.user;

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

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) throw error;
  return data;
}
