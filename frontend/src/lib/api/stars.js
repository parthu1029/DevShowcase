import { supabase } from "../supabaseClient";

export async function starProject(project_id) {
  const user = (await supabase.auth.getUser()).data.user;

  const { data, error } = await supabase
    .from("project_stars")
    .insert({
      user_id: user.id,
      project_id
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function unstarProject(project_id) {
  const user = (await supabase.auth.getUser()).data.user;

  const { error } = await supabase
    .from("project_stars")
    .delete()
    .eq("project_id", project_id)
    .eq("user_id", user.id);

  if (error) throw error;
}


export async function toggleStar(projectId) {
  const user = (await supabase.auth.getUser()).data.user;

  // check if exists
  const { data: existing } = await supabase
    .from("project_stars")
    .select("*")
    .eq("user_id", user.id)
    .eq("project_id", projectId)
    .single();

  if (existing) {
    // remove star
    await supabase
      .from("project_stars")
      .delete()
      .eq("id", existing.id);

    return { starred: false };
  }

  // add star
  await supabase
    .from("project_stars")
    .insert({ user_id: user.id, project_id: projectId });

  return { starred: true };
}
