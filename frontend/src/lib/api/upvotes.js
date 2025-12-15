import { supabase } from "../supabaseClient";

export async function upvoteProject(project_id) {
  const user = (await supabase.auth.getUser()).data.user;

  if (!user) throw new Error("Not logged in");

  const { data, error } = await supabase
    .from("project_upvotes")
    .insert({
      user_id: user.id,
      project_id
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeUpvote(project_id) {
  const user = (await supabase.auth.getUser()).data.user;

  const { error } = await supabase
    .from("project_upvotes")
    .delete()
    .eq("project_id", project_id)
    .eq("user_id", user.id);

  if (error) throw error;
}


export async function toggleUpvote(projectId) {
  const user = (await supabase.auth.getUser()).data.user;

  const { data: existing } = await supabase
    .from("project_upvotes")
    .select("*")
    .eq("user_id", user.id)
    .eq("project_id", projectId)
    .single();

  if (existing) {
    await supabase
      .from("project_upvotes")
      .delete()
      .eq("id", existing.id);

    return { voted: false };
  }

  await supabase
    .from("project_upvotes")
    .insert({ user_id: user.id, project_id: projectId });

  return { voted: true };
}
