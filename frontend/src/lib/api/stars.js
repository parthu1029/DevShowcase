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
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) throw new Error("Not logged in");

  // check if exists (avoid .single() error when 0 rows)
  const { data: rows, error: selErr } = await supabase
    .from("project_stars")
    .select("id")
    .eq("user_id", user.id)
    .eq("project_id", projectId)
    .limit(1);
  if (selErr) throw selErr;
  const existing = rows && rows[0];

  if (existing) {
    // remove star
    const { error: delErr } = await supabase
      .from("project_stars")
      .delete()
      .eq("id", existing.id);
    if (delErr) throw delErr;
    return { starred: false };
  }

  // add star
  const { error: insErr } = await supabase
    .from("project_stars")
    .insert({ user_id: user.id, project_id: projectId });
  if (insErr) throw insErr;
  return { starred: true };
}
