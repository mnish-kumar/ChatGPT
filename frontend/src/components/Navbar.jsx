import { useState } from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { name: "Products", path: "/products" },
  { name: "Stories", path: "/stories" },
  { name: "Pricing", path: "/pricing" },
  { name: "Docs", path: "/docs" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative flex items-center border mx-4 max-md:w-full max-md:justify-between border-slate-700 px-6 py-4 rounded-full text-white text-sm">

      {/* Logo */}
      <NavLink to="/">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
        >
          <circle cx="4.706" cy="16" r="4.706" fill="#D9D9D9" />
          <circle cx="16.001" cy="4.706" r="4.706" fill="#D9D9D9" />
          <circle cx="16.001" cy="27.294" r="4.706" fill="#D9D9D9" />
          <circle cx="27.294" cy="16" r="4.706" fill="#D9D9D9" />
        </svg>
      </NavLink>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-6 ml-7">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `relative overflow-hidden h-6 group ${
                isActive ? "text-indigo-500" : ""
              }`
            }
          >
            <span className="block group-hover:-translate-y-full transition-transform duration-300">
              {item.name}
            </span>
            <span className="block absolute top-full left-0 group-hover:-translate-y-full transition-transform duration-300">
              {item.name}
            </span>
          </NavLink>
        ))}
      </div>

      {/* Desktop Buttons */}
      <div className="hidden ml-14 md:flex items-center gap-4">
        <NavLink
          to="/contact"
          className="border border-slate-600 hover:bg-slate-800 px-4 py-2 rounded-full text-sm font-medium transition"
        >
          Contact
        </NavLink>

        <NavLink
          to="/get-started"
          className="bg-white hover:shadow-[0px_0px_30px_14px] shadow-[0px_0px_30px_7px] hover:shadow-white/50 shadow-white/50 text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-100 transition duration-300"
        >
          Get Started
        </NavLink>
      </div>

      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-gray-400"
      >
        ☰
      </button>

      {/* Mobile Menu */}
      <div
        className={`absolute top-20 left-0 bg-black w-full flex-col items-center gap-4 py-6 text-base ${
          isOpen ? "flex" : "hidden"
        }`}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className="hover:text-indigo-600"
          >
            {item.name}
          </NavLink>
        ))}

        <NavLink
          to="/contact"
          className="border border-slate-600 hover:bg-slate-800 px-4 py-2 rounded-full text-sm font-medium transition"
        >
          Contact
        </NavLink>

        <NavLink
          to="/get-started"
          className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-100 transition duration-300"
        >
          Get Started
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;