import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const user = useSelector((state) => state.user.currentUser);
  const location = useLocation();

  const links = useMemo(
    () => [
      { label: "Home", to: '/' },
      { label: "Features", to: "/#dsjfb" },
      { label: "How it works", to: "/#dsnbd" },
    ],
    []
  );

  const activeTo = useMemo(() => {
    const current = `${location.pathname}${location.hash}`;
    if (current === "/#" || current === "/#top") return "/";
    return current === "/" ? "/" : current;
  }, [location.pathname, location.hash]);

  const closeMenu = () => setOpen(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-3 z-50"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <nav className="relative flex items-center justify-between rounded-full border border-white/60 bg-white/25 px-4 py-3 shadow-xl shadow-black/5 backdrop-blur-xl sm:px-6">
          {/* Logo */}
          <Link
            className="inline-flex items-center gap-2 font-semibold tracking-tight text-slate-900"
            to="/"
            onClick={closeMenu}
          >
            <span className="text-base sm:text-lg">JarviSync</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const isActive = activeTo === l.to;

              return (
                <div key={l.to} className="relative px-2">
                  <Link
                    to={l.to}
                    className="relative block rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:text-slate-900"
                  >
                    {l.label}
                  </Link>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active"
                      className="pointer-events-none absolute inset-0 -z-10 rounded-full border border-white/70 bg-white/30 shadow-sm"
                      transition={{ type: "spring", stiffness: 360, damping: 28 }}
                    />
                  )}
                </div>
              );
            })}

            {/* Auth Button */}
            <div className="ml-2">
              <Link to={user ? "/dashboard" : "/register"}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 320, damping: 22 }}
                  className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[#89A8B2] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10 transition-colors hover:bg-[#89A8B2]/90"
                >
                  {user ? "Dashboard" : "Get Started"}
                </motion.button>
              </Link>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/25 text-slate-900 shadow-sm backdrop-blur-xl md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Mobile Menu */}
          <AnimatePresence>
            {open && (
              <motion.div
                id="mobile-menu"
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-0 right-0 top-[calc(100%+10px)] z-50 overflow-hidden rounded-3xl border border-white/60 bg-white/30 p-3 shadow-2xl shadow-black/10 backdrop-blur-xl md:hidden"
              >
                <div className="flex flex-col">
                  {links.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      onClick={closeMenu}
                      className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 transition-colors hover:bg-white/35"
                    >
                      {l.label}
                    </Link>
                  ))}

                  <div className="my-2 h-px w-full bg-linear-to-r from-transparent via-white/70 to-transparent" />

                  <Link to={user ? "/dashboard" : "/register"} onClick={closeMenu}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 320, damping: 22 }}
                      className="w-full cursor-pointer rounded-2xl bg-[#89A8B2] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10 transition-colors hover:bg-[#89A8B2]/90"
                    >
                      {user ? "Dashboard" : "Get Started"}
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </motion.header>
  );
};

export default Navbar;
