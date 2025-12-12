import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ProjectDetailModal({ project, onClose, onUpvote, onStar, user, focusComments }) {
  const navigate = useNavigate();
  const backdropRef = useRef(null);
  const modalRef = useRef(null);
  const lastActiveRef = useRef(null);
  const commentInputRef = useRef(null);

  useEffect(() => {
    // Save last focused element so we can restore focus on close
    lastActiveRef.current = document.activeElement;

    // Lock scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // focus modal container after mount
    setTimeout(() => {
      if (modalRef.current) modalRef.current.focus();
      if (focusComments && commentInputRef.current) {
        // small delay so layout has settled
        setTimeout(() => commentInputRef.current.focus(), 120);
      }
    }, 70);

    // ESC to close
    function handleKey(e) {
      if (e.key === "Escape") handleClose();
      if (e.key === "Tab") maintainFocus(e);
    }
    window.addEventListener("keydown", handleKey);
    return () => {
      // restore
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
      // restore focus
      try {
        lastActiveRef.current?.focus?.();
      } catch (err) {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Focus trap implementation: keep Tab cycling inside modal
  function maintainFocus(e) {
    if (!modalRef.current) return;
    const focusable = modalRef.current.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function handleClose() {
    onClose?.();
    // Use history back to return URL state
    try {
      navigate(-1);
    } catch (err) {
      // fallback: just call onClose
    }
  }

  function onBackdropClick(e) {
    if (e.target === backdropRef.current) {
      handleClose();
    }
  }

  if (!project) return null;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };
  const panelVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.98 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 320, damping: 28 } },
    exit: { y: 20, opacity: 0, scale: 0.99, transition: { duration: 0.15 } }
  };

  // Portal root
  return createPortal(
    <AnimatePresence>
      <motion.div
        key="detail-modal"
        ref={backdropRef}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onBackdropClick}
        className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-8"
        aria-hidden="false"
      >
        {/* translucent backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-hidden="true"
        />

        {/* Modal panel */}
        <motion.div
          ref={modalRef}
          tabIndex={-1}
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-title"
          className={`
            relative z-10
            w-full
            max-h-[96vh]
            overflow-auto
            focus:outline-none

            /* mobile: full screen sheet look */
            rounded-none p-4
            sm:rounded-xl sm:p-6

            /* width control for desktop - leaves space left/right */
            sm:max-w-[900px] md:max-w-[1100px] lg:max-w-[1200px]
          `}
          style={{
            // on small screens, fill nearly whole viewport; on larger screens panel is centered with margins
            boxShadow: "0 20px 60px rgba(2,6,23,0.6)"
          }}
        >
          {/* Close Button (top-right) */}
          <div className="flex items-start justify-end">
            <button
              onClick={handleClose}
              aria-label="Close project"
              className="text-text-secondary hover:text-text-primary p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent/40"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="mt-1">
            <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="sm:flex-1">
                <h2 id="project-title" className="text-2xl font-semibold text-text-primary">{project.title}</h2>
                <div className="mt-2 text-text-secondary text-sm">
                  by <span className="font-medium text-text-primary">{project.author?.name ?? "Anonymous"}</span>
                  <span className="mx-2">·</span>
                  <span>{new Date(project.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Upvote */}
                <button
                  onClick={(e) => { e.stopPropagation(); if (!user) return; onUpvote?.(project.id); }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-background border border-border hover:bg-background-softer focus:outline-none focus:ring-2 focus:ring-accent/40"
                  aria-pressed="false"
                >
                  <svg className="w-4 h-4 text-text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l8 8h-6v10h-4V11H4l8-8z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span className="text-text-primary text-sm">{project.votes ?? 0}</span>
                </button>

                {/* Star */}
                <button
                  onClick={(e) => { e.stopPropagation(); if (!user) return; onStar?.(project.id); }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-background border border-border hover:bg-background-softer focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  <svg className="w-4 h-4 text-text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 17.3 7.3 20l1.1-5.1L4.5 11l5.2-.5L12 6.5l2.3 4 5.2.5-4 3.9L16.7 20z" />  </svg>
                </button>
              </div>
            </header>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
              {/* Main column: description + comments */}
              <div>
                <article className="prose prose-invert max-w-none text-text-secondary">
                  <p>{project.description}</p>
                </article>

                {/* Comments area */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Comments</h3>

                  <div className="space-y-3">
                    {/* Example static comments (replace with dynamic later) */}
                    <div className="bg-background border border-border rounded p-3">
                      <div className="text-sm text-text-primary font-medium">Anita</div>
                      <div className="text-text-secondary text-sm mt-1">Amazing work — learned a lot from this!</div>
                    </div>

                    {/* comment input */}
                    <div>
                      <textarea
                        ref={commentInputRef}
                        className="w-full min-h-[90px] p-3 rounded-md bg-background border border-border text-text-primary"
                        placeholder={user ? "Write a comment..." : "Login to comment"}
                        disabled={!user}
                        aria-disabled={!user}
                      />
                      <div className="mt-2 flex items-center justify-between">
                        {!user ? (
                          <div className="text-xs text-accent">Login to add a comment</div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button className="px-3 py-1 rounded bg-accent text-white">Post comment</button>
                          </div>
                        )}
                        <div className="text-xs text-text-secondary">Comments are public</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column: meta + preview */}
              <aside>
                <div className="bg-background border border-border rounded p-3">
                  <div className="text-xs text-text-secondary">Tech & Languages</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(project.languages || []).concat(project.tech || []).slice(0, 12).map(t => (
                      <span key={t} className="text-xs px-2 py-1 rounded bg-background text-text-secondary border border-border">{t}</span>
                    ))}
                  </div>

                  <div className="mt-4 text-xs text-text-secondary">
                    <div>GitHub: <a href={project.github || "#"} onClick={(e)=>e.stopPropagation()} className="underline">repo</a></div>
                    <div className="mt-2">Submitted: {new Date(project.created_at).toLocaleDateString()}</div>
                  </div>
                </div>

                {project.preview ? (
                  <div className="mt-4 bg-background border border-border rounded p-2">
                    <div className="text-xs text-text-secondary mb-2">Preview</div>
                    <div className="aspect-video bg-black/30 rounded overflow-hidden">
                      <iframe src={project.preview} title="preview" className="w-full h-full" />
                    </div>
                  </div>
                ) : null}
              </aside>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
