import { useEffect, useState } from "react";
import ProjectsGrid from "../components/ProjectsGrid";
import ProjectDetailModal from "../components/ProjectDetailModal";
import { useLocation, useNavigate } from "react-router-dom";

/* MOCK DATA */
const MOCK = [
  {
    id: "p1",
    title: "OpenCV Satellite Change Detector",
    description: "A project that detects building changes between satellite images using U-Net and postprocessing.",
    tech: ["PyTorch", "OpenCV", "tensorflow", "numpy", "globe"],
    languages: ["Python"],
    author: { name: "test@abcd.com" },
    votes: 15,
    created_at: "2025-06-20",
    github: "#",
    preview: "https://devshowcase-sooty.vercel.app/"
  },
  {
    id: "p2",
    title: "Realtime Chat with Supabase",
    description: "A small chat app using Supabase Realtime and React.",
    starred:'true',
    tech: ["React", "Tailwind"],
    languages: ["JavaScript"],
    author: { name: "Partha" },
    votes: 42,
    created_at: "2025-12-01",
    github: "#",
    preview: ""
  },
];

export default function Home({ user }) {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [focusComments, setFocusComments] = useState(false);

  const [tab, setTab] = useState("mine"); // current tab: mine | starred

  const location = useLocation();
  const navigate = useNavigate();

  // simulate fetch
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setProjects(MOCK);
      setLoading(false);
    }, 700);
    return () => clearTimeout(t);
  }, []);

  // modal logic
  useEffect(() => {
    const match = location.pathname.match(/^\/projects\/(.+)$/);
    if (match) {
      const id = match[1];
      const p = projects.find((x) => x.id === id) || MOCK.find((x) => x.id === id);
      setSelected(p || null);
    } else {
      setSelected(null);
    }
  }, [location.pathname, projects]);

  // upvote
  function handleUpvote(id) {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, votes: (p.votes || 0) + 1 } : p
      )
    );
  }

  // star
  function handleStar(id, starred) {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, starred } : p))
    );
  }

  // open modal
  function handleOpen(id, opts = {}) {
    const p = projects.find((x) => x.id === id);
    setSelected(p);
    setFocusComments(!!opts.focusComments);
    navigate(`/projects/${id}`, { state: { modal: true } });
  }

  function handleClose() {
    navigate("/");
  }

  /* FILTER PROJECTS BY TAB */
  let filteredProjects = projects;

  if (tab === "mine" && user) {
    filteredProjects = projects.filter(
      (p) => p.author?.name?.toLowerCase() === user.name?.toLowerCase()
    );
  }

  if (tab === "starred" && user) {
    filteredProjects = projects.filter((p) => p.starred);
  }

  return (
    <div className="pb-10">

      {/* ---------- HEADER ---------- */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary">Project Feed</h1>
        <p className="text-text-secondary mt-1">
          Discover community projects — upvote and support interesting work.
        </p>

        <div className="mt-6 flex gap-4 border-b border-border pb-2">
          

          {user && (
            <>
              <button
                onClick={() => setTab("mine")}
                className={`pb-2 px-1 ${
                  tab === "mine"
                    ? "text-accent border-b-2 border-accent font-medium"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                My Projects
              </button>

              <button
                onClick={() => setTab("starred")}
                className={`pb-2 px-1 ${
                  tab === "starred"
                    ? "text-accent border-b-2 border-accent font-medium"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Starred
              </button>
            </>
          )}
        </div>
      </header>

      {/* ---------- PROJECT GRID ---------- */}
      <ProjectsGrid
        projects={filteredProjects}
        loading={loading}
        onUpvote={handleUpvote}
        onStar={handleStar}
        onOpen={handleOpen}
        user={user}
      />

      {/* ---------- MODAL ---------- */}
      {selected && (
        <ProjectDetailModal
          project={selected}
          onClose={handleClose}
          onUpvote={handleUpvote}
          onStar={handleStar}
          user={user}
          focusComments={focusComments}
        />
      )}
    </div>
  );
}
