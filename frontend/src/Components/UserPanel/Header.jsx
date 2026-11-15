import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import logo2 from "/logo2.jpeg";
import { FiChevronDown, FiMenu, FiX } from "react-icons/fi";

function Header() {
  const [genre, setGenre] = useState([]);
  const categoryRef = useRef(null);
  const [genreOpen, setGenreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("Users");

  useEffect(() => {
    const getGenre = async () => {
      try {
        const res = await axios.get("http://localhost:3000/genre");
        setGenre(res.data);
      } catch (error) {
        console.error(`Get genre error in header: ${error.message}`);
      }
    };
    getGenre();
  }, []);

  const handleClickOutside = (event) => {
    if (
      categoryRef.current &&
      !categoryRef.current.contains(event.target) &&
      !categoryRef.current.contains(event.target)
    ) {
      setGenreOpen(false);
    }
  };
  const navClass = ({ isActive }) => isActive ? "active" : "";

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="brand-mark"><img src={logo2} alt="BookHub" /><span><span className="brand-kicker">Community library</span><br />BookHub</span></Link>
        <button className="quiet-action md:hidden" onClick={() => setMobileOpen((open) => !open)} aria-label="Toggle navigation">{mobileOpen ? <FiX /> : <FiMenu />}</button>
        <nav className={`site-nav ${mobileOpen ? "flex" : "hidden md:flex"}`}>
          <NavLink to="/" className={navClass}>Home</NavLink>
          <div className="relative" ref={categoryRef}>
            <button className="flex items-center gap-1 border-0 bg-transparent cursor-pointer" onClick={() => setGenreOpen((open) => !open)} aria-expanded={genreOpen}>Browse by genre <FiChevronDown className={genreOpen ? "rotate-180" : ""} /></button>
            {genreOpen && <div className="absolute top-8 left-0 z-40 w-56 border border-[#ded7ca] bg-[#fbf9f4] p-2 shadow-lg">{genre.map((item) => <button key={item._id} onClick={() => { navigate(`/books?genreid=${item._id}`); setGenreOpen(false); }} className="block w-full cursor-pointer border-0 bg-transparent px-3 py-2 text-left text-sm text-[#45554d] hover:bg-[#eee8dc] hover:text-[#b36124]">{item.name}</button>)}</div>}
          </div>
          <NavLink to="/books" className={navClass}>Catalog</NavLink>
          <NavLink to="/about" className={({ isActive }) => `${navClass({ isActive })} optional-nav`}>About</NavLink>
          {storedUser ? <NavLink to="/profile" className={({ isActive }) => `${navClass({ isActive })} primary-action`}>My account</NavLink> : <Link to="/login" className="primary-action">Sign in</Link>}
        </nav>
      </div>
    </header>
  );
}

export default Header;