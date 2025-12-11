import React, { useMemo, useState } from "react";
import ProjectCard from "./ProjectCard";
import SkeletonCard from "./SkeletonCard";

export default function ProjectsGrid({ projects = [], loading = false, onUpvote }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("latest"); // or "top"

  const filtered = useMemo(() => {
    let res = projects;
    if (query.trim()) {
      const q = query.toLowerCase();
      res = res.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.tech || []).join(" ").toLowerCase().includes(q)
      );
    }
    if (sort === "top") {
      res = [...res].sort((a,b) => (b.votes||0) - (a.votes||0));
    } else {
      res = [...res].sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    }
    return res;
  }, [projects, query, sort]);

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 w-full sm:max-w-md">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects or tech (e.g. React, Supabase)"
            className="w-full px-3 py-2 rounded-md bg-background border border-border text-text-primary text-sm focus:ring-2 focus:ring-accent/50"
            aria-label="Search projects"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="text-text-secondary text-sm">Sort</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-2 py-1 bg-background border border-border rounded-md text-sm text-text-primary"
            aria-label="Sort projects"
          >
            <option value="latest">Latest</option>
            <option value="top">Most upvoted</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center">
          <h3 className="text-text-primary text-2xl font-semibold mb-2">No projects found</h3>
          <p className="text-text-secondary mb-4">Try adjusting your search or be the first to submit a project.</p>
          <a href="/submit" className="inline-block px-4 py-2 rounded-md bg-accent text-white">Submit Project</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => (
            <ProjectCard key={p.id} project={p} onUpvote={onUpvote} />
          ))}
        </div>
      )}
    </section>
  );
}
