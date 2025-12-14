import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProjectsGrid from "../components/ProjectsGrid";
import { MOCK } from "../mock/projects"; // Your mock until Supabase data
import NotFound from "./NotFound";

const RESERVED = new Set([
  "about",
  "login",
  "signup",
  "explore",
  "submit",
  "projects",
  "api",
  "settings"
]);


export default function Profile({ user }) {
  const { username } = useParams();

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);

  if (RESERVED.has(username.toLowerCase())) {
    return <NotFound />;
  }

  // Load user info based on URL username
  useEffect(() => {
    async function loadUser() {
      setLoading(true);

      // MOCK EXAMPLE — REPLACE with Supabase:
      const found = {
        name: username,
        email: `${username}@example.com`,
        id: username, 
        bio: "Developer who loves building cool things.",
      };

      setProfileUser(found);
      setLoading(false);
    }

    loadUser();
  }, [username]);

  if (loading || !profileUser) {
    return (
      <div className="flex justify-center items-center h-40 text-text-secondary">
        Loading profile…
      </div>
    );
  }

  const isOwner = user?.name?.toLowerCase() === profileUser.name.toLowerCase();

  const userProjects = MOCK.filter(
    (p) => p.author?.name?.toLowerCase() === profileUser.name.toLowerCase()
  );

  const starredProjects = MOCK.filter((p) => p.starred);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto pt-6 pb-20"
    >
      {/* HEADER CARD */}
      <div className="relative bg-background-softer border border-border rounded-xl p-6 flex gap-6 items-center">

        {/* Avatar */}
        <div className="h-20 w-20 rounded-full bg-accent flex items-center justify-center text-white text-3xl font-semibold">
          {profileUser.name[0].toUpperCase()}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">{profileUser.name}</h1>
          <p className="text-text-secondary text-sm">{profileUser.email}</p>

          {profileUser.bio && (
            <p className="text-text-secondary text-sm mt-2">{profileUser.bio}</p>
          )}
        </div>

        {/* EDIT BUTTON — only for logged-in owner */}
        {isOwner && (
          <button
            className="absolute top-4 right-4 p-2 rounded-md border border-border bg-background hover:bg-background-softer"
            title="Edit Profile"
          >
            ✎
          </button>
        )}
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-background border border-border rounded-lg p-4">
          <p className="text-3xl font-bold text-text-primary">{userProjects.length}</p>
          <p className="text-text-secondary text-sm">Projects Submitted</p>
        </div>
        <div className="bg-background border border-border rounded-lg p-4">
          <p className="text-3xl font-bold text-text-primary">{starredProjects.length}</p>
          <p className="text-text-secondary text-sm">Starred Projects</p>
        </div>
      </div>

      {/* USER PROJECTS */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          {isOwner ? "Your Projects" : `${profileUser.name}'s Projects`}
        </h2>

        <ProjectsGrid
          projects={userProjects}
          loading={false}
          onUpvote={() => {}}
          onStar={() => {}}
          onOpen={() => {}}
          user={user}
        />
      </div>
    </motion.div>
  );
}
