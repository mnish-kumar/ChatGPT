import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="w-full bg-amber-400 flex p-5 items-center">

      <a className="text-4xl font-medium" href="/">
        JarviSync
      </a>

      <div className="w-full flex items-center justify-end gap-3 text-lg font-medium">
        <NavLink to="/">Home</NavLink>
        <NavLink to={"/pricing"}>Pricing</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>

        <button
        className="bg-gray-500 hover:bg-white hover:text-black text-white font-medium py-1.5 px-2 rounded cursor-pointer"
        >
          Get Started</button>
      </div>
    </div>
  );
};

export default Navbar;
