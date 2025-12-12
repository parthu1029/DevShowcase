import React, { useState } from "react";
import TagInput from "../components/TagInput";
import { useNavigate } from "react-router-dom";

const PLATFORMS = ["GitHub", "Kaggle", "Bitbucket", "GitLab", "Other"];

function isValidUrl(val) {
  try {
    const u = new URL(val);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export default function Submit({ user }) {
  const nav = useNavigate();

  // form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState("GitHub");
  const [platformUrl, setPlatformUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [tags, setTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // validation
  function validate() {
    const e = {};
    if (!title || title.trim().length < 3) e.title = "Title is required (min 3 chars).";
    if (!description || description.trim().length < 10) e.description = "Description is required (min 10 chars).";
    if (!platformUrl || !isValidUrl(platformUrl)) e.platformUrl = "Please provide a valid URL (http/https).";
    // optional: require tags at least one? not necessary
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submitProject(e) {
    e?.preventDefault();
    if (!validate()) {
      // focus first error
      return;
    }
    setIsSubmitting(true);

    // Build payload - this is exact shape you can store in Supabase later
    const payload = {
      title: title.trim(),
      description: description.trim(),
      platform: platform,
      platform_url: platformUrl.trim(),
      preview_url: previewUrl.trim() || null,
      show_preview: !!showPreview,
      tags: tags,
      created_at: new Date().toISOString(),
      // when wiring Supabase add: user_id, author_name, etc.
    };

    try {
      // TODO: replace with supabase.from('projects').insert([payload]) when ready
      console.log("SUBMIT payload:", payload);

      // mock success delay
      await new Promise((res) => setTimeout(res, 600));

      // simple success behavior: show an inline confirmation and reset / optionally navigate
      setIsSubmitting(false);
      // Option: redirect to Dashboard or to created project route after backend returns id
      alert("Project submitted (mock). Later this will be persisted to Supabase.");
      // reset form (optional)
      setTitle("");
      setDescription("");
      setPlatform("GitHub");
      setPlatformUrl("");
      setPreviewUrl("");
      setShowPreview(false);
      setTags([]);
      // nav("/"); // uncomment if you want to redirect
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      alert("Submit failed. See console for details.");
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-semibold text-text-primary mb-2">Submit a Project</h1>
      <p className="text-text-secondary mb-6">Share your project so the community can discover and upvote it.</p>

      {!user ? (
        <div className="p-4 rounded-md bg-background-softer border border-border text-text-secondary">
          Please <a href="/login" className="underline text-accent">log in</a> to submit a project.
        </div>
      ) : (
        <form onSubmit={submitProject} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-text-primary">Title <span className="text-accent">*</span></label>
            <input
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
              className={`mt-2 w-full px-3 py-2 rounded-md bg-background border ${errors.title ? "border-red-500" : "border-border"} text-text-primary`}
              placeholder="Short, descriptive project title"
              aria-invalid={!!errors.title}
            />
            {errors.title && <div className="text-xs text-red-400 mt-1">{errors.title}</div>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-primary">Description <span className="text-accent">*</span></label>
            <textarea
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
              rows={6}
              className={`mt-2 w-full px-3 py-2 rounded-md bg-background border ${errors.description ? "border-red-500" : "border-border"} text-text-primary`}
              placeholder="Describe your project: what it does, tech used, and why it's cool."
              aria-invalid={!!errors.description}
            />
            {errors.description && <div className="text-xs text-red-400 mt-1">{errors.description}</div>}
          </div>

          {/* Platform + URL */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
            <div>
              <label className="block text-sm font-medium text-text-primary">Platform</label>
              <select value={platform} onChange={(e)=>setPlatform(e.target.value)} className="mt-2 w-full px-3 py-2 rounded-md bg-background border border-border text-text-primary">
                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-text-primary">{platform} URL <span className="text-accent">*</span></label>
              <input
                value={platformUrl}
                onChange={(e)=>setPlatformUrl(e.target.value)}
                placeholder={`${platform} URL (https://...)`}
                className={`mt-2 w-full px-3 py-2 rounded-md bg-background border ${errors.platformUrl ? "border-red-500" : "border-border"} text-text-primary`}
                aria-invalid={!!errors.platformUrl}
              />
              {errors.platformUrl && <div className="text-xs text-red-400 mt-1">{errors.platformUrl}</div>}
            </div>
          </div>

          {/* Preview URL + show preview */}
          <div>
            <label className="block text-sm font-medium text-text-primary">Preview URL (optional)</label>
            <div className="flex gap-3 mt-2">
              <input
                value={previewUrl}
                onChange={(e)=>setPreviewUrl(e.target.value)}
                placeholder="Live demo URL (https://...)"
                className="flex-1 px-3 py-2 rounded-md bg-background border border-border text-text-primary"
              />
              <label className="inline-flex items-center gap-2 text-text-secondary">
                <input type="checkbox" checked={showPreview} onChange={(e)=>setShowPreview(e.target.checked)} className="h-4 w-4" />
                <span className="text-sm">Show preview</span>
              </label>
            </div>

            {showPreview && previewUrl && isValidUrl(previewUrl) ? (
              <div className="mt-3 border border-border rounded overflow-hidden">
                {/* iframe preview — some sites block embedding; this is the simplest approach for now */}
                <div className="aspect-video">
                  <iframe src={previewUrl} title="preview" className="w-full h-full" />
                </div>
              </div>
            ) : showPreview && previewUrl && !isValidUrl(previewUrl) ? (
              <div className="mt-2 text-xs text-red-400">Preview URL is not a valid URL.</div>
            ) : null}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-text-primary">Tags</label>
            <div className="mt-2">
              <TagInput value={tags} onChange={setTags} placeholder="Add tags: React, Python, Supabase" />
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-md bg-accent text-white font-medium hover:bg-accent-hover disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Submit Project"}
            </button>

            <button
              type="button"
              onClick={() => {
                setTitle(""); setDescription(""); setPlatform("GitHub"); setPlatformUrl(""); setPreviewUrl(""); setShowPreview(false); setTags([]); setErrors({});
              }}
              className="px-3 py-2 rounded-md bg-background-softer border border-border text-text-primary"
            >
              Reset
            </button>

            <div className="text-xs text-text-secondary ml-auto">Required fields marked with <span className="text-accent">*</span></div>
          </div>
        </form>
      )}
    </div>
  );
}
