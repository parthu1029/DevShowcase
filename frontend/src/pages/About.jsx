import React from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" }
  })
};

const card = {
  hidden: { opacity: 0, y: 25 },
  show: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.45 }
  })
};

export default function About() {
  return (
    <div className="max-w-4xl mx-auto pt-10 pb-20">

      {/* Heading */}
      <motion.h1
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="text-4xl font-bold text-text-primary mb-4 tracking-tight"
      >
        About DevShowcase
      </motion.h1>

      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={2}
        className="text-text-secondary text-lg leading-relaxed mb-10"
      >
        DevShowcase is a community-powered hub where developers publish the
        projects they build, discover new ideas, get feedback, and grow their
        identity as creators. Inspired by the minimal, elegant design language
        of GitHub and Vercel, DevShowcase puts your work at the center.
      </motion.p>

      {/* Feature Section */}
      <div className="space-y-6">

        {/* CARD 1 */}
        <motion.div
          variants={card}
          initial="hidden"
          animate="show"
          className="p-6 rounded-xl bg-background-softer border border-border shadow-soft hover:shadow-md transition-shadow duration-300"
        >
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            🚀 Share Beautifully
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Publish your projects with clean presentation, live previews, and
            rich metadata. From AI tools to web apps — show the world what
            you're building.
          </p>
        </motion.div>

        {/* CARD 2 */}
        <motion.div
          variants={card}
          initial="hidden"
          animate="show"
          custom={2}
          className="p-6 rounded-xl bg-background-softer border border-border shadow-soft hover:shadow-md transition-shadow duration-300"
        >
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            ⭐ Get Real Feedback
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Developers can star, upvote, and comment on your projects. Learn
            from the community, iterate faster, and build smarter.
          </p>
        </motion.div>

        {/* CARD 3 */}
        <motion.div
          variants={card}
          initial="hidden"
          animate="show"
          custom={3}
          className="p-6 rounded-xl bg-background-softer border border-border shadow-soft hover:shadow-md transition-shadow duration-300"
        >
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            📈 Grow Your Developer Identity
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Your profile becomes a living portfolio — track your progress,
            showcase achievements, and build trust with teams or clients.
          </p>
        </motion.div>

        {/* CARD 4 */}
        <motion.div
          variants={card}
          initial="hidden"
          animate="show"
          custom={4}
          className="p-6 rounded-xl bg-background-softer border border-border shadow-soft hover:shadow-md transition-shadow duration-300"
        >
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            ⚙️ Built With Modern Tools
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Powered by React, TailwindCSS, Supabase, and Framer Motion — designed
            for performance, clarity, and developer friendliness.
          </p>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={6}
        className="text-center text-text-secondary text-sm mt-14 opacity-70"
      >
        Made by Partha — Keep building. 🚀
      </motion.p>
    </div>
  );
}
