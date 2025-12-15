import { supabase } from "../supabaseClient";

export async function createProject(project) {
  const { data, error } = await supabase
    .from("projects")
    .insert(project)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getProjects() {
  try{
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error){
      console.error("SUPABASE ERROR:", error);
      throw error;}

    return data.map(p => ({
      ...p,
      author_name: p.profiles?.username || "Unknown",
      has_star: p.stars?.some(s => s.user_id === supabase.auth.user()?.id)
    }));
  } catch (err) {
    console.error("API FAILED:", err);
    throw err;
  }
}


export async function getProjectById(id) {
  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      profiles(username)
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProject(id) {
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
