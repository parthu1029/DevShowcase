import React from "react";
import { motion } from "framer-motion";
import { MOCK } from "../mock/projects"; // Using your mock list

export default function Profile({ user }) {
  if (!user) return null;

  // Derive stats from mock data
  const myProjects = MOCK.filter((p) => p.author?.id === user.id);
  const myStarred = MOCK.filter((p) => p.starred);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto pt-6"
    >
      <h1 className="text-3xl font-bold text-text-primary mb-8">Profile</h1>

      {/* Profile card */}
      <div className="bg-background-softer border border-border rounded-xl p-6 flex gap-6 items-center">
        <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center text-white text-2xl font-semibold">
          {user.name?.[0]?.toUpperCase() || "U"}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            {user.name}
          </h2>
          <p className="text-text-secondary text-sm">{user.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-background border border-border rounded-lg p-4">
          <p className="text-3xl font-bold text-text-primary">{myProjects.length}</p>
          <p className="text-text-secondary text-sm">Projects Submitted</p>
        </div>
        <div className="bg-background border border-border rounded-lg p-4">
          <p className="text-3xl font-bold text-text-primary">{myStarred.length}</p>
          <p className="text-text-secondary text-sm">Starred Projects</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8">
        <button className="px-4 py-2 rounded-md bg-background border border-border text-text-primary hover:bg-background-softer text-sm mr-3">
          Edit Profile (coming soon)
        </button>
      </div>
    </motion.div>
  );
}
