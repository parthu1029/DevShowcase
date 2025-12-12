import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ProjectDetailModal({ project, onClose, onUpvote, onStar, user, focusComments }) {
  const navigate = useNavigate();

  function handleClose() {
    onClose?.();
    // pop history (go back) so URL returns
    navigate(-1);
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} />

      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="relative z-10 max-w-4xl w-full bg-background-softer border border-border rounded-xl p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-title"
      >
        <header className="flex items-start justify-between gap-4">
          <div>
            <h2 id="project-title" className="text-2xl font-semibold text-text-primary">{project.title}</h2>
            <div className="text-text-secondary mt-1">by <span className="font-medium text-text-primary">{project.author?.name}</span></div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => { if (!user) return; onStar?.(project.id); }} className="p-2 rounded-md bg-background text-text-primary border border-border hover:bg-background-softer">
              {/* reuse icons visually */}
              ⭐
            </button>
            <button onClick={() => { if (!user) return; onUpvote?.(project.id); }} className="p-2 rounded-md bg-background text-text-primary border border-border hover:bg-background-softer">
              👍 {project.votes ?? 0}
            </button>
            <button onClick={handleClose} aria-label="Close modal" className="px-3 py-1 rounded-md bg-background text-text-primary border border-border hover:bg-background-softer">Close</button>
          </div>
        </header>

        <section className="mt-6 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <p className="text-text-secondary">{project.description}</p>

            {/* comments area */}
            <div className="mt-6">
              <h3 className="text-text-primary font-semibold mb-2">Comments</h3>
              <div className="space-y-3">
                {/* sample readonly comments */}
                <div className="bg-background border border-border rounded p-3">
                  <div className="text-sm text-text-primary font-medium">Anita</div>
                  <div className="text-text-secondary text-sm mt-1">Amazing work — learned a lot from this!</div>
                </div>
                {/* comment input (disabled if not logged in) */}
                <div className="mt-3">
                  <textarea
                    className="w-full min-h-[90px] p-3 rounded-md bg-background border border-border text-text-primary"
                    placeholder={user ? "Write a comment..." : "Login to comment"}
                    disabled={!user}
                    aria-disabled={!user}
                  />
                  {!user ? (
                    <div className="mt-2 text-xs text-accent">Login to add a comment</div>
                  ) : (
                    <div className="mt-2 text-right">
                      <button className="px-3 py-1 rounded bg-accent text-white">Post comment</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* right column — optional preview / meta */}
          <aside className="md:col-span-1">
            <div className="bg-background border border-border rounded p-3">
              <div className="text-xs text-text-secondary">Tech & Languages</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {(project.languages || []).concat(project.tech || []).slice(0,8).map(t => (
                  <span key={t} className="text-xs px-2 py-1 rounded bg-background text-text-secondary border border-border">{t}</span>
                ))}
              </div>

              <div className="mt-4 text-xs text-text-secondary">
                <div>GitHub: <a href={project.github || "#"} onClick={(e)=>e.stopPropagation()} className="underline">repo</a></div>
                <div className="mt-2">Submitted: {new Date(project.created_at).toLocaleDateString()}</div>
              </div>
            </div>

            {/* optional preview area placeholder */}
            {project.preview && (
              <div className="mt-4 bg-background border border-border rounded p-2">
                <div className="text-xs text-text-secondary mb-2">Preview</div>
                <div className="aspect-video bg-black/30 rounded overflow-hidden">
                  {/* use iframe or image */}
                  <iframe src={project.preview} title="preview" className="w-full h-full" />
                </div>
              </div>
            )}
          </aside>
        </section>
      </motion.div>
    </div>
  );
}
