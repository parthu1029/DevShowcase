import { supabase } from "../supabaseClient";

export async function addComment(project_id, content) {
  const user = (await supabase.auth.getUser()).data.user;

  const { data, error } = await supabase
    .from("comments")
    .insert({
      user_id: user.id,
      project_id,
      content
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getComments(project_id) {
  const { data, error } = await supabase
    .from("comments")
    .select(`
      id,
      content,
      created_at,
      user_id,
      project_id,
      profiles (
        id,
        username,
        avatar_url
      )
    `)
    .eq("project_id", project_id)
    .order("created_at", { ascending: false }); // Show newest first

  if (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
  
  console.log("Fetched comments:", data);
  return data || [];
}
