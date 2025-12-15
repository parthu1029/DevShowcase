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
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) throw new Error("Not logged in");

  // find existing upvote (avoid .single() error when 0 rows)
  const { data: rows, error: selErr } = await supabase
    .from("project_upvotes")
    .select("id")
    .eq("user_id", user.id)
    .eq("project_id", projectId)
    .limit(1);
  if (selErr) throw selErr;
  const existing = rows && rows[0];

  let voted;
  if (existing) {
    const { error: delErr } = await supabase
      .from("project_upvotes")
      .delete()
      .eq("id", existing.id);
    if (delErr) throw delErr;
    voted = false;
  } else {
    const { error: insErr } = await supabase
      .from("project_upvotes")
      .insert({ user_id: user.id, project_id: projectId });
    if (insErr) throw insErr;
    voted = true;
  }

  // update cached vote count on project (best-effort)
  const { data: proj, error: projErr } = await supabase
    .from("projects")
    .select("votes")
    .eq("id", projectId)
    .single();
  if (!projErr && proj) {
    const next = Math.max(0, (proj.votes || 0) + (voted ? 1 : -1));
    await supabase
      .from("projects")
      .update({ votes: next })
      .eq("id", projectId);
  }

  return { voted };
}
