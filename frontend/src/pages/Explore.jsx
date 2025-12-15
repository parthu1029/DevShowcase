import { useState, useEffect } from "react";
import ProjectsGrid from "../components/ProjectsGrid";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../lib/api/projects"; 
import { toggleUpvote } from "../lib/api/upvotes";
import { toggleStar } from "../lib/api/stars";

export default function Explore({ user }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("trending");
  const [selectedTag, setSelectedTag] = useState(null);
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const navigate = useNavigate();

  function openProject(id) {
    navigate(`/projects/${id}`);
  }

  async function handleUpvote(id) {
    try {
      const res = await toggleUpvote(id);
      setProjects(prev => prev.map(p =>
        p.id === id ? { ...p, votes: (p.votes || 0) + (res.voted ? 1 : -1), voted: res.voted } : p
      ));
    } catch (err) {
      console.error("Upvote failed", err);
    }
  }

  async function handleStar(id) {
    try {
      const res = await toggleStar(id);
      setProjects(prev => prev.map(p =>
        p.id === id ? { ...p, starred: res.starred } : p
      ));
    } catch (err) {
      console.error("Star action failed", err);
    }
  }

  const allTags = Array.from(
    new Set(
      projects.flatMap(
        p => [...(p.tech || []), ...(p.languages || [])]
      )
    )
  ).slice(0, 15);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    let results = [...projects];

    if (query.trim() !== "") {
      const q = query.toLowerCase();
      results = results.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.author?.name || "").toLowerCase().includes(q)
      );
    }

    if (selectedTag) {
      results = results.filter(p =>
        (p.tech || []).includes(selectedTag) ||
        (p.languages || []).includes(selectedTag)
      );
    }

    if (sort === "trending") {
      results.sort((a, b) => (b.votes || 0) - (a.votes || 0));
    } else if (sort === "newest") {
      results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    setFiltered(results);
  }, [projects, query, sort, selectedTag]);

  return (
    <div className="pt-4">
      {/* SEARCH BAR */}
      <div className="flex justify-center">
        <div className="w-full max-w-2xl mb-6">
          <input
            type="text"
            placeholder="Search projects…"
            className="w-full px-5 py-3 text-sm rounded-lg bg-background-softer border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">

        {/* Sort dropdown */}
        <select
          className="px-3 py-2 rounded-md bg-background border border-border text-sm text-text-secondary"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="trending">🔥 Trending</option>
          <option value="newest">🕒 Newest</option>
        </select>

        {/* Tag filters */}
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`px-3 py-1 rounded-md text-xs border transition
                ${selectedTag === tag
                  ? "bg-accent text-white border-accent"
                  : "bg-background text-text-secondary border-border hover:bg-background-softer"
                }
              `}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* RESULTS */}
      <div>
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-text-secondary py-20"
          >
            <p className="text-lg">No matching projects found.</p>
            <p className="text-sm mt-2">Try a different keyword or tag.</p>
          </motion.div>
        ) : (
          <ProjectsGrid
            projects={filtered}
            loading={false}
            onUpvote={handleUpvote} 
            onStar={handleStar}
            onOpen={(id) => openProject(id)}
            user={user}
          />
        )}
      </div>
    </div>
  );
}
