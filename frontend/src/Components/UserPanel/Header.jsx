import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import BtnLogin from "./BtnLogin.jsx";
import Myprofile from "./Myprofile.jsx";
import logo2 from "/logo2.jpeg";

function Header() {
  const [genre, setGenre] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const categoryRef = useRef(null);
  const toggleRef = useRef(null);
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
      toggleRef.current &&
      !toggleRef.current.contains(event.target)
    ) {
      setIsActive(false);
    }
  };

  const handleToggle = () => {
    setIsActive((prev) => !prev);
  };

  const handleGenreClick = (genreId) => {
    navigate(`/books?genreid=${genreId}`);
    setIsActive(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="py-2 px-4 sm:px-6 lg:px-8 h-[10vh] w-full flex justify-between items-center bg-white shadow text-gray-600 relative">
        <Link to="/dashboard/index" className="flex items-center">
          <img src={logo2} alt="BookHub Logo" className="h-12 w-auto" />
        </Link>

        <nav className="flex items-center space-x-4 sm:space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `no-underline text-lg font-medium transition-colors duration-200 ${
                isActive ? "text-orange-500 border-b-2 border-orange-500" : "hover:text-orange-500"
              }`
            }
          >
            Home
          </NavLink>
          <button
            id="h-category"
            ref={toggleRef}
            onClick={handleToggle}
            className="text-lg font-medium flex items-center gap-1 hover:text-orange-500 transition-colors duration-200"
            aria-expanded={isActive}
            aria-controls="genre-dropdown"
          >
            Genre
            <svg
              className={`w-4 h-4 transform transition-transform ${isActive ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `no-underline text-lg font-medium transition-colors duration-200 ${
                isActive ? "text-orange-500 border-b-2 border-orange-500" : "hover:text-orange-500"
              }`
            }
          >
            About Us
          </NavLink>
          <NavLink
            to="/books"
            className={({ isActive }) =>
              `no-underline text-lg font-medium transition-colors duration-200 ${
                isActive ? "text-orange-500 border-b-2 border-orange-500" : "hover:text-orange-500"
              }`
            }
          >
            Books
          </NavLink>
          {storedUser ? <Myprofile /> : <BtnLogin />}
        </nav>

        <div
          id="genre-dropdown"
          className={`absolute top-full right-4 mt-2 w-64 sm:w-80 md:w-96 bg-white border border-gray-200 rounded-lg shadow-lg transition-opacity duration-300 ${
            isActive ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          ref={categoryRef}
        >
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-1 p-2 list-none">
            {genre.map((genredata, index) => (
              <li
                key={index}
                className="text-sm p-2 hover:bg-gray-100 hover:rounded-md transition-colors duration-200"
              >
                <button
                  onClick={() => handleGenreClick(genredata._id)}
                  className="w-full text-left text-gray-700 hover:text-orange-500"
                >
                  {genredata.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </header>
      <hr className="border-gray-200" />
    </>
  );
}

export default Header;