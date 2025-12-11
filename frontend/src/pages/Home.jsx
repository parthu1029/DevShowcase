import { useEffect, useState } from "react";
import ProjectsGrid from "../components/ProjectsGrid";

/* Mock data for frontend testing. Will be Replaced with Supabase fetch later. */
const MOCK = [
  {
    id: "p1",
    title: "OpenCV Satellite Change Detector",
    description: "A project that detects building changes between satellite images using U-Net and postprocessing.",
    tech: ["Python", "PyTorch", "U-Net", "OpenCV"],
    author: { name: "Anita" },
    votes: 15,
    created_at: "2025-06-20",
    github: "#"
  },
  {
    id: "p2",
    title: "Realtime Chat with Supabase",
    description: "A small chat app using Supabase Realtime and React.",
    tech: ["React", "Supabase", "Tailwind"],
    author: { name: "Partha" },
    votes: 42,
    created_at: "2025-12-01",
    github: "#"
  },
];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  // simulate fetch delay
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setProjects(MOCK);
      setLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  // simple local upvote simulation (optimistic)
  function handleUpvote(projectId) {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, votes: (p.votes||0) + 1 } : p));
    // later: call Supabase and handle rollback if failed
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary">Project Feed</h1>
        <p className="text-text-secondary mt-1">Discover community projects — upvote and support interesting work.</p>
      </header>

      <ProjectsGrid projects={projects} loading={loading} onUpvote={handleUpvote} />
    </div>
  );
}
