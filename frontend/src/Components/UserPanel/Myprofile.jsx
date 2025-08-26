import React from "react";
import { useAuth } from "../../../../backend/context/AuthProvider.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function Myprofile() {
  const [authUser, setAuthUser] = useAuth();
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("Users");
  let loggedusername = "Guest";
  let userimage = null;

  // Parse user data from localStorage or use authUser
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      loggedusername = parsedUser.username || "Guest";
      userimage = parsedUser.image || null;
    } catch (error) {
      console.error("Failed to parse user data:", error);
      toast.error("Failed to load user data");
    }
  } else if (authUser?.user) {
    loggedusername = authUser.user.username || "Guest";
    userimage = authUser.user.image || null;
  }

  const handleLogout = () => {
    try {
      setAuthUser({ ...authUser, user: null });
      localStorage.removeItem("Users");
      toast.success("You have logged out successfully.");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div className="relative flex-none">
      <button
        className="flex items-center gap-2 h-10 px-2 border-2 border-gray-200 rounded-full hover:border-orange-500 transition-colors duration-200"
        aria-expanded="false"
        aria-controls="user-dropdown"
        aria-label="Toggle user menu"
      >
        <img
          src={userimage || "https://via.placeholder.com/40"}
          alt={`${loggedusername}'s avatar`}
          className="h-8 w-8 rounded-full object-cover"
        />
        <span className="text-sm font-medium text-gray-600 truncate max-w-[100px]">
          {loggedusername}
        </span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <ul
        id="user-dropdown"
        className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg transition-opacity duration-300 opacity-0 invisible data-[open=true]:opacity-100 data-[open=true]:visible"
        data-open="false"
      >
        <li>
          <Link
            to="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-orange-500 rounded-md"
          >
            Profile
          </Link>
        </li>
        <li>
          <Link
            to="/settings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-orange-500 rounded-md"
          >
            Settings
          </Link>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-orange-500 rounded-md"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Myprofile;