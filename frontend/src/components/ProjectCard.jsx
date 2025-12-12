import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// icon components (inline for brevity)
const StarIcon = ({ filled }) => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
    <path d="M12 17.3 7.3 20l1.1-5.1L4.5 11l5.2-.5L12 6.5l2.3 4 5.2.5-4 3.9L16.7 20z" />
  </svg>
);
const UpvoteIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3l8 8h-6v10h-4V11H4l8-8z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const CommentIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function ProjectCard({
  project,
  onUpvote,
  onStar,
  onOpen,
  user
}) {
  const [limit, setLimit] = useState(5); // how many tags to show
  const [hoverHint, setHoverHint] = useState(null); // {type:'upvote'|'star', text}
  const [localStarred, setLocalStarred] = useState(!!project.starred);
  const [localVoted, setLocalVoted] = useState(false);

  // derive tags: prefer languages first then tech; combine and dedupe
  const languages = project.languages || []; // expected array
  const tech = project.tech || [];
  const combined = Array.from(new Set([...languages, ...tech])).filter(Boolean);

  // responsive logic for tag limit
  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w >= 1024) setLimit(5);
      else if (w >= 768) setLimit(4);
      else setLimit(3);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // handlers
  function handleUpvote(e) {
    e.stopPropagation();
    if (!user) {
      setHoverHint({ type: "upvote", text: "Login to upvote" });
      return;
    }
    if (localVoted) return; // optimistic prevention (frontend)
    setLocalVoted(true);
    onUpvote?.(project.id);
  }

  function handleStar(e) {
    e.stopPropagation();
    if (!user) {
      setHoverHint({ type: "star", text: "Login to star" });
      return;
    }
    setLocalStarred(prev => !prev);
    onStar?.(project.id, !localStarred);
  }

  // hide hint after a short time
  useEffect(() => {
    if (!hoverHint) return;
    const t = setTimeout(() => setHoverHint(null), 2000);
    return () => clearTimeout(t);
  }, [hoverHint]);

  return (
    <motion.article
      layout
      whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(0,0,0,0.5)" }}
      onClick={() => onOpen?.(project.id)}
      className="cursor-pointer bg-background-softer border border-border rounded-xl p-5 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/40"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") onOpen?.(project.id); }}
      aria-label={`Open project ${project.title}`}
    >
      <header className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-text-primary text-lg font-semibold leading-snug">{project.title}</h3>
          <div className="mt-2 text-text-secondary text-sm">
            by <span className="font-medium text-text-primary">{project.author?.name ?? "Anonymous"}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleStar}
              onMouseEnter={() => !user && setHoverHint({ type: "star", text: "Login to star" })}
              onMouseLeave={() => setHoverHint(null)}
              aria-pressed={localStarred}
              title={localStarred ? "Unstar" : "Star"}
              className={`p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent/40 ${localStarred ? "bg-accent text-white" : "bg-background text-text-primary border border-border hover:bg-accent/10"}`}
            >
              <StarIcon filled={localStarred} />
            </button>

            <button
              onClick={handleUpvote}
              onMouseEnter={() => !user && setHoverHint({ type: "upvote", text: "Login to upvote" })}
              onMouseLeave={() => setHoverHint(null)}
              aria-pressed={localVoted}
              title="Upvote"
              className={`p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent/40 ${localVoted ? "bg-accent text-white" : "bg-background text-text-primary border border-border hover:bg-accent/10"}`}
            >
              <UpvoteIcon />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); onOpen?.(project.id, { focusComments: true }); }}
              title="Comments"
              className="p-2 rounded-md bg-background text-text-primary border border-border hover:bg-background-softer focus:outline-none focus:ring-2 focus:ring-accent/40"
            >
              <CommentIcon />
            </button>
          </div>

          <div className="text-sm text-text-secondary">
            <span className="font-medium text-text-primary">{project.votes ?? 0}</span> votes
          </div>
        </div>
      </header>

      <p className="text-text-secondary text-sm mt-4 line-clamp-3">{project.description}</p>

      <footer className="mt-4 flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {combined.slice(0, limit).map((t) => (
            <span key={t} className="text-xs px-2 py-1 rounded-md bg-background text-text-secondary border border-border">
              {t}
            </span>
          ))}

          {combined.length > limit && (
            <span className="text-xs px-2 py-1 rounded-md bg-background text-text-secondary border border-border">
              +{combined.length - limit}
            </span>
          )}
        </div>

        <div className="text-xs text-text-secondary">
          <a href={project.github || "#"} onClick={(e)=>e.stopPropagation()} className="underline">View repo</a>
        </div>
      </footer>

      {/* Inline hover/click hint for unauthenticated users */}
      {hoverHint && (
        <div className="mt-3 text-xs text-accent bg-background border border-border rounded px-3 py-1 inline-block">
          {hoverHint.text}
        </div>
      )}
    </motion.article>
  );
}
