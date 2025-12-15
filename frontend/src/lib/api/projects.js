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
  try {
    const { data: auth } = await supabase.auth.getUser();
    const userId = auth?.user?.id || null;

    const { data: projects, error: pErr } = await supabase
      .from("projects")
      .select(`
        *,
        profiles:profiles(username, avatar_url)
      `)
      .order("created_at", { ascending: false });
    if (pErr) throw pErr;

    let starSet = new Set();
    let voteSet = new Set();

    if (userId) {
      const [{ data: stars, error: sErr }, { data: votes, error: vErr }] = await Promise.all([
        supabase.from("project_stars").select("project_id").eq("user_id", userId),
        supabase.from("project_upvotes").select("project_id").eq("user_id", userId)
      ]);
      if (sErr) throw sErr;
      if (vErr) throw vErr;
      starSet = new Set(stars?.map((r) => r.project_id) || []);
      voteSet = new Set(votes?.map((r) => r.project_id) || []);
    }

    return (projects || []).map((p) => ({
      ...p,
      author: { name: p.profiles?.username || "Unknown", avatar_url: p.profiles?.avatar_url },
      starred: starSet.has(p.id),
      voted: voteSet.has(p.id)
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
