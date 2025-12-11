import React from "react";

/**
 * Props:
 *  - project: { id, title, description, tech: [], author: {name}, votes }
 *  - onUpvote(projectId) -> callback
 *  - userVoted (optional) -> boolean
 */
export default function ProjectCard({ project, onUpvote, userVoted = false }) {
  const { id, title, description, tech = [], author = {}, votes = 0 } = project;

  return (
    <article className="bg-background-softer border border-border rounded-xl p-5 hover:shadow-lg transition-shadow">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-text-primary text-lg font-semibold leading-snug">{title}</h3>
          <div className="mt-2 text-text-secondary text-sm">
            by <span className="font-medium text-text-primary">{author.name ?? "Anonymous"}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <button
            aria-pressed={userVoted}
            onClick={() => onUpvote?.(id)}
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium focus:outline-none
              ${userVoted ? "bg-accent text-white" : "bg-background text-text-primary border border-border hover:bg-accent/10"}`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 21l-8-8h6V3h4v10h6l-8 8z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{votes}</span>
          </button>
        </div>
      </header>

      <p className="text-text-secondary text-sm mt-4 line-clamp-3">{description}</p>

      <footer className="mt-4 flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {tech.slice(0,6).map((t) => (
            <span key={t} className="text-xs px-2 py-1 rounded-md bg-background text-text-secondary border border-border">
              {t}
            </span>
          ))}
        </div>

        <div className="text-xs text-text-secondary"> <a href={project.github || "#"} className="underline">View repo</a> </div>
      </footer>
    </article>
  );
}
