import { supabase } from "../supabaseClient";

async function ensureProfile(user) {
  const { data: rows, error: selErr } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .limit(1);
  if (selErr) throw selErr;
  if (rows && rows.length) return;

  const raw = (user.user_metadata?.username || user.email?.split("@")[0] || "user").toLowerCase();
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
      const { error: insErr } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          username: candidate,
          full_name: user.user_metadata?.full_name ?? null,
          avatar_url: user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null
        });
      if (insErr) throw insErr;
      return;
    }
    candidate = `${base}${Math.floor(Math.random() * 1000)}`.slice(0, 28);
  }
  throw new Error("Unable to create profile");
}

export async function createProject(project) {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  const userId = user?.id;
  if (!userId) throw new Error("Not logged in");

  await ensureProfile(user);

  const payload = {
    ...project,
    user_id: project.user_id ?? userId,
  };

  const { data, error } = await supabase
    .from("projects")
    .insert(payload)
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

    return (projects || []).map((p) => {
      const platforms = Array.isArray(p.platforms) ? p.platforms : [];
      const findByName = (names) => platforms.find((pl) => names.includes((pl?.name || "").toLowerCase()))?.url || null;
      const githubUrl = findByName(["github"])
        || platforms[0]?.url
        || null;
      const previewUrl = findByName(["preview", "live", "demo", "website"]);
      return {
        ...p,
        author: { name: p.profiles?.username || "Unknown", avatar_url: p.profiles?.avatar_url },
        starred: starSet.has(p.id),
        voted: voteSet.has(p.id),
        github: githubUrl,
        preview: previewUrl,
      };
    });
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
