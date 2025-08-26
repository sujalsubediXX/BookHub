import React from "react";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

function BtnLogin() {
  return (
    <Link
      to="/login"
      className="flex items-center gap-1 h-10 px-3 py-1 text-sm font-medium text-gray-600 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 transition-colors duration-200 no-underline"
      role="button"
      aria-label="Go to login page"
    >
      <FaUser aria-hidden="true" className="mr-1" />
      Login
    </Link>
  );
}

export default BtnLogin;