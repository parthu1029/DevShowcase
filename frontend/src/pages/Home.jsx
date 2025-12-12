import { useEffect, useState } from "react";
import ProjectsGrid from "../components/ProjectsGrid";
import ProjectDetailModal from "../components/ProjectDetailModal";
import { useLocation, useNavigate, useParams } from "react-router-dom";

/* MOCK DATA */
const MOCK = [
  {
    id: "p1",
    title: "OpenCV Satellite Change Detector",
    description: "A project that detects building changes between satellite images using U-Net and postprocessing.",
    tech: ["PyTorch", "OpenCV", "tensorflow", "numpy", "globe"],
    languages: ["Python"],
    author: { name: "Anil" },
    votes: 15,
    created_at: "2025-06-20",
    github: "#",
    preview: ""
  },
  {
    id: "p2",
    title: "Realtime Chat with Supabase",
    description: "A small chat app using Supabase Realtime and React.",
    tech: ["React", "Tailwind"],
    languages: ["JavaScript"],
    author: { name: "Partha" },
    votes: 42,
    created_at: "2025-12-01",
    github: "#",
    preview: ""
  },
  // add more mock projects here...
];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [focusComments, setFocusComments] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams(); // used for direct nav scenario

  // simulate fetch
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setProjects(MOCK);
      setLoading(false);
    }, 700);
    return () => clearTimeout(t);
  }, []);

  // open modal when route /projects/:id present OR when navigate pushes
  useEffect(() => {
    // if URL path matches /projects/:id
    const match = location.pathname.match(/^\/projects\/(.+)$/);
    if (match) {
      const id = match[1];
      const p = projects.find(x => x.id === id) || MOCK.find(x => x.id === id);
      if (p) {
        setSelected(p);
      } else {
        // if not found, could fetch from backend later
        setSelected(null);
      }
    } else {
      setSelected(null);
    }
  }, [location.pathname, projects]);

  // local optimistic upvote
  function handleUpvote(id) {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, votes: (p.votes||0) + 1 } : p));
    // later: call Supabase
  }

  // local star toggling
  function handleStar(id, starred) {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, starred } : p));
  }

  // open project modal and push url
  function handleOpen(id, opts = {}) {
    const p = projects.find(x => x.id === id);
    setSelected(p);
    setFocusComments(!!opts.focusComments);
    navigate(`/projects/${id}`, { state: { modal: true } });
  }

  function handleClose() {
    setSelected(null);
    setFocusComments(false);
    // navigate back handled in modal
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary">Project Feed</h1>
        <p className="text-text-secondary mt-1">Discover community projects — upvote and support interesting work.</p>
      </header>

      <ProjectsGrid
        projects={projects}
        loading={loading}
        onUpvote={handleUpvote}
        onStar={handleStar}
        onOpen={handleOpen}
        user={null} /* pass user state from App when integrating auth */
      />

      {/* modal shown when selected project is set */}
      {selected && (
        <ProjectDetailModal
          project={selected}
          onClose={handleClose}
          onUpvote={handleUpvote}
          onStar={handleStar}
          user={null}
          focusComments={focusComments}
        />
      )}
    </div>
  );
}
