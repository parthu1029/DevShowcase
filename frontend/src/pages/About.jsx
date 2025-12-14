import React from "react";
import { motion } from "framer-motion";
export default function About() {
  return (
    <div className="max-w-3xl mx-auto pt-6 pb-12">
      
      {/* Page Header */}
      <h1 className="text-3xl font-bold text-text-primary mb-3 tracking-tight">
        About DevShowcase
      </h1>

      <p className="text-text-secondary leading-relaxed mb-8">
        DevShowcase is a community-driven platform where developers share what
        they build, discover new ideas, get inspired, and grow as creators.
        Whether you're learning, experimenting, or launching real products —
        this is your space to showcase your craft.
      </p>

      {/* Feature Sections */}
      <div className="space-y-4">
        
        {/* CARD 1 */}
        <div className="p-4 rounded-xl bg-background-softer border border-border shadow-sm">
          <h2 className="text-lg font-semibold text-text-primary mb-1">
            Share Your Projects
          </h2>

          <p className="text-text-secondary text-sm leading-relaxed">
            Publish your work — web apps, AI tools, automations, experiments,
            or anything you create. Present it cleanly with previews, tags,
            descriptions, and GitHub links.
          </p>
        </div>

        {/* CARD 2 */}
        <div className="p-4 rounded-xl bg-background-softer border border-border shadow-sm">
          <h2 className="text-lg font-semibold text-text-primary mb-1">
            Get Feedback & Support
          </h2>

          <p className="text-text-secondary text-sm leading-relaxed">
            The community can star your projects, upvote ideas, and leave
            comments. Great projects deserve visibility — DevShowcase helps you
            reach people who appreciate your work.
          </p>
        </div>

        {/* CARD 3 */}
        <div className="p-4 rounded-xl bg-background-softer border border-border shadow-sm">
          <h2 className="text-lg font-semibold text-text-primary mb-1">
            Grow as a Developer
          </h2>

          <p className="text-text-secondary text-sm leading-relaxed">
            Every project you publish reflects your journey. Build your
            developer identity, track progress, learn from others, and stay
            motivated to create. DevShowcase is your personal launchpad.
          </p>
        </div>

        {/* CARD 4 (optional, looks professional) */}
        <div className="p-4 rounded-xl bg-background-softer border border-border shadow-sm">
          <h2 className="text-lg font-semibold text-text-primary mb-1">
            Powered by Modern Tools
          </h2>

          <p className="text-text-secondary text-sm leading-relaxed">
            Built using React, TailwindCSS, Supabase, and Framer Motion —
            delivering a smooth, fast, minimal experience inspired by GitHub
            and Vercel&apos;s clean aesthetic.
          </p>
        </div>
      </div>

      {/* Footer Text */}
      <p className="text-center text-text-secondary text-sm mt-10 opacity-60">
        Made by Partha. Keep building. 🚀
      </p>
    </div>
  );
}
