import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";


const Navbar = () => {
  const [open, setOpen] = useState(false);
  const user = useSelector((state) => state.user.currentUser);

  const navItems = ["Home", "Pricing", "About", "Contact"];

  return (
    <nav className="relative flex justify-between items-center border mx-4 max-md:w-full border-slate-700 px-6 py-4 rounded-full text-white text-sm bg-gray-600">
      {/* Logo */}
      <NavLink className="text-2xl font-semibold" to="/">
        JarviSync
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6 ml-7">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
            className={({ isActive }) =>
              `relative overflow-hidden h-6 group ${
                isActive ? "text-yellow-400" : ""
              }`
            }
          >
            {/* First text */}
            <span className="block group-hover:-translate-y-full transition-transform duration-300">
              {item}
            </span>

            {/* Second text (fixed animation) */}
            <span className="block absolute top-full left-0 group-hover:-translate-y-full transition-transform duration-300">
              {item}
            </span>
          </NavLink>
        ))}

        {/* Auth Button */}
        <NavLink to={user ? "/dashboard" : "/register"}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium cursor-pointer hover:bg-slate-200 shadow-md"
          >
            {user ? "Dashboard" : "Get Started"}
          </motion.button>
        </NavLink>
      </div>

      {/* Mobile Toggle */}
      <button className="md:hidden" onClick={() => setOpen(!open)}>
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="white"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-20 left-0 w-full bg-black flex flex-col items-center gap-4 py-6 md:hidden rounded-xl border border-slate-700 z-50">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              onClick={() => setOpen(false)}
            >
              {item}
            </NavLink>
          ))}

          <NavLink
            to={user ? "/dashboard" : "/register"}
            onClick={() => setOpen(false)}
          >
            <button className="bg-white text-black px-4 py-2 rounded-full">
              {user ? "Dashboard" : "Get Started"}
            </button>
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
