import React from "react";
import { Link, Outlet, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const Dashboard = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    toast.success("You have logged out successfully.");
    setTimeout(() => {
      navigate("/");
    }, 1000);
    // try {
    //   setAuthUser({
    //     ...authUser,
    //     user: null
    //   });
    //   localStorage.removeItem("Users");
    //   toast.success("You have logged out successfully.");
    //   setTimeout(() => {
    //     window.location.href="http://localhost:5173/";
    //   }, 1000);
    // } catch (error) {
    //   toast.error(`Error: ${error.message}`);
    // }
  };
  function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
      sidebar.classList.toggle("w-64");
      sidebar.classList.toggle("w-20");
    }
  }
  const breadcrumbMap = {
    '/': 'Home',
    '/dashboard/index': 'Home',
    '/dashboard/users': 'Users',
    '/dashboard/issuebook': 'IssueBooks',
    '/dashboard/managebook': 'ManageBooks',
    '/dashboard/managecategories': 'ManageCategories',
    '/dashboard/returnbook': 'ReturnBooks',
    '/dashboard/penaltymanagement': 'PenaltyManagement',
    '/dashboard/setting': 'Settings',
};

// Determine the current breadcrumb
const currentBreadcrumb = breadcrumbMap[location.pathname] || 'Home';
  return (
    <div className="h-[100vh]">
      <div className="bg-gray-100 font-sans">
        <div className="flex">
          {/* Sidebar */}
          <div
            id="sidebar"
            className="w-64 bg-white shadow-lg transition-width duration-300 ease-in-out h-[100vh]"
          >
            <div className="flex items-center justify-between p-4">
              <Link to="/dashboard/index" className="text-blue-600 font-bold text-xl">
                AdminHub
              </Link>
              <button
                // onClick={toggleSidebar}
                className="p-2 rounded-full hover:bg-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </button>
            </div>
            <nav className="mt-6">
              <ul>
                <NavLink
                  to="/dashboard/index"
                  className={({ isActive }) =>
                    `no-underline py-2 px-4 hover:bg-gray-100 flex items-center ${
                      isActive ? "bg-gray-100 font-semibold" : ""
                    }`
                  }
                >
                  <span className="mr-3">🏠</span>
                  <span className="truncate">Dashboard</span>
                </NavLink>
                <NavLink
                  to="/dashboard/users"
                  className={({ isActive }) =>
                    `py-2 px-4 hover:bg-gray-100 flex items-center ${
                      isActive ? "bg-gray-100 font-semibold" : ""
                    }`
                  }
                >
                  <span className="mr-3">👤</span>
                  <span className="truncate">Users</span>
                </NavLink>

                <NavLink
                  to="/dashboard/issuebook"
                  className={({ isActive }) =>
                    `py-2 px-4 hover:bg-gray-100 flex items-center ${
                      isActive ? "bg-gray-100 font-semibold" : ""
                    }`
                  }
                >
                  <span className="mr-3">📚</span>
                  <span className="truncate">Issue Books</span>
                </NavLink>
                <NavLink
                  to="/dashboard/issuelibrarycard"
                  className={({ isActive }) =>
                    `py-2 px-4 hover:bg-gray-100 flex items-center ${
                      isActive ? "bg-gray-100 font-semibold" : ""
                    }`
                  }
                >
                  <span className="mr-3">🏷️</span>
                  <span className="truncate">Issue Library Card</span>
                </NavLink>

                <NavLink
                  to="/dashboard/managebook"
                  className={({ isActive }) =>
                    `py-2 px-4 hover:bg-gray-100 flex items-center ${
                      isActive ? "bg-gray-100 font-semibold" : ""
                    }`
                  }
                >
                  <span className="mr-3">📖</span>
                  <span className="truncate">Manage Books</span>
                </NavLink>

                <NavLink
                  to="/dashboard/managecategories"
                  className={({ isActive }) =>
                    `py-2 px-4 hover:bg-gray-100 flex items-center ${
                      isActive ? "bg-gray-100 font-semibold" : ""
                    }`
                  }
                >
                  <span className="mr-3">🗂️</span>
                  <span className="truncate">Manage Categories</span>
                </NavLink>

                <NavLink
                  to="/dashboard/returnbook"
                  className={({ isActive }) =>
                    `py-2 px-4 hover:bg-gray-100 flex items-center ${
                      isActive ? "bg-gray-100 font-semibold" : ""
                    }`
                  }
                >
                  <span className="mr-3">🔄</span>
                  <span className="truncate">Return Books</span>
                </NavLink>

                <NavLink
                  to="/dashboard/penaltymanagement"
                  className={({ isActive }) =>
                    `py-2 px-4 hover:bg-gray-100 flex items-center ${
                      isActive ? "bg-gray-100 font-semibold" : ""
                    }`
                  }
                >
                  <span className="mr-3">💸</span>
                  <span className="truncate">Penalty Management</span>
                </NavLink>

                <NavLink
                  to="/dashboard/setting"
                  className={({ isActive }) =>
                    `py-2 px-4 hover:bg-gray-100 flex items-center ${
                      isActive ? "bg-gray-100 font-semibold" : ""
                    }`
                  }
                >
                  <span className="mr-3">⚙️</span>
                  <span className="truncate">Settings</span>
                </NavLink>

                <li className="py-2 px-4 hover:bg-gray-100 text-red-500 flex items-center">
                  <span className="mr-3">🚪</span>

                  <button className="logout truncate" onClick={handleLogout}>
                    <span className="truncate">Logout</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
          {/* Main Content */}
          <div className="flex-1">
            <header className="bg-white shadow py-[10px] px-4 flex items-center justify-between">
              <h1 className="text-xl font-semibold">Dashboard <span className="font-bold text-[20px]">  &gt;</span> <span className="text-[18px]">{currentBreadcrumb}</span>  </h1>
              <div className="flex items-center space-x-4">
               
                <div className="rounded-full w-10 h-10 bg-gray-200">
                  <img
                    src="https://via.placeholder.com/40"
                    alt="User"
                    className="w-full h-full rounded-full"
                  />
                </div>
              </div>
            </header>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
