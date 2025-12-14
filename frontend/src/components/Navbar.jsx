import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const handleLogout = () => {
    setOpen(false);
    setMobileOpen(false);
    onLogout?.();
    navigate("/explore");
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive
        ? "bg-background-softer text-text-primary"
        : "text-text-secondary hover:bg-background-softer hover:text-text-primary"
    }`;

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    }

    if (mobileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  return (
    <header className="bg-background-soft text-text-primary sticky top-0 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left: Brand */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center gap-3">
              <div className="h-8 w-8 flex items-center justify-center rounded-md bg-accent text-white font-bold">DS</div>
              <span className="font-semibold text-lg tracking-tight">DevShowcase</span>
            </NavLink>
          </div>

          {/* Center: Links */}
          <nav className="hidden sm:flex sm:space-x-4 sm:items-center">
            {user && <NavLink to="/" className={linkClass}>Home</NavLink>}
            {!user && <NavLink to="/about" className={linkClass}>About</NavLink>}
            {user && <NavLink to="/submit" className={linkClass}>Submit Project</NavLink>}
            <NavLink to="/explore" className={({ isActive }) => linkClass({ isActive }) + " hidden md:inline"}>Explore</NavLink>
          </nav>

          {/* Right: Auth / Avatar */}
          <div className="flex items-center space-x-3">
            {!user ? (
              <div className="hidden sm:flex items-center gap-2">
                <NavLink
                  to="/login"
                  className="px-3 py-1.5 rounded-md bg-accent text-white text-sm font-medium hover:bg-accent-hover"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="px-3 py-1.5 rounded-md text-sm font-medium bg-background-softer text-text-primary hover:bg-background"
                >
                  Sign Up
                </NavLink>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">                
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setOpen(prev => !prev)}
                    className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-background-softer"
                  >
                    <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-white font-semibold">
                      {user.name ? user.name[0].toUpperCase() : "U"}
                    </div>
                    <span className="text-sm text-text-primary">{user.name ?? "User"}</span>
                  </button>

                  {open && (
                    <div className="absolute right-0 mt-2 w-44 bg-background-softer rounded-md shadow-lg py-1 border border-border">
                      <NavLink to="/profile" className="block px-4 py-2 text-sm text-text-primary hover:bg-background">
                        Profile
                      </NavLink>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-background"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="sm:hidden flex items-center">
              <button
                onClick={() => setMobileOpen(prev => !prev)}
                className="inline-flex items-center justify-center p-2 rounded-md hover:bg-background-softer"
                aria-expanded={open}
              >
                <svg className="h-6 w-6 text-text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {open ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div ref={mobileMenuRef} className="sm:hidden bg-background-soft border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user && <NavLink to="/" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:bg-background-softer hover:text-text-primary">
              Home
            </NavLink>}

            {!user && <NavLink to="/about" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:bg-background-softer hover:text-text-primary">
              About
            </NavLink>}

            {user && (
              <NavLink to="/submit" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:bg-background-softer hover:text-text-primary">
                Submit Project
              </NavLink>
            )}

            <NavLink to="/explore" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:bg-background-softer hover:text-text-primary">
              Explore
            </NavLink>

            {!user ? (
              <>
                <NavLink to="/login" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md bg-accent text-white text-base font-medium">
                  Login
                </NavLink>
                <NavLink to="/signup" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:bg-background-softer hover:text-text-primary">
                  Sign Up
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/profile" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:bg-background-softer hover:text-text-primary">
                  Profile
                </NavLink>
                <button onClick={() => { handleLogout(); setOpen(false); }} className="w-full text-left px-3 py-2 rounded-md text-text-secondary hover:bg-background-softer">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
