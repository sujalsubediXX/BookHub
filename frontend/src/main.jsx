import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./App.css";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Components/UserPanel/Home.jsx";
import About from "./Components/UserPanel/About.jsx";
import Login from "./Components/UserPanel/Login.jsx";
import Register from "./Components/UserPanel/Register.jsx";
import Books from "./Components/UserPanel/Books.jsx";
import Profile from "./Components/UserPanel/Profile.jsx";

// Admin Side
import Dashboard from "./Components/AdminPanel/Dashboard.jsx";
import IssueBooks from "./Components/AdminPanel/IssueBooks.jsx";
import ManageBooks from "./Components/AdminPanel/ManageBooks.jsx";
import ManageCategories from "./Components/AdminPanel/ManageCategories.jsx";
import PenaltiesManagement from "./Components/AdminPanel/PenaltiesManagement.jsx";
import ReturnBooks from "./Components/AdminPanel/ReturnBooks.jsx";
import Setting from "./Components/AdminPanel/Setting.jsx";
import Users from "./Components/AdminPanel/Users.jsx";

import AuthProvider from "../../backend/context/AuthProvider.jsx";
import Front from "./Components/AdminPanel/Front.jsx";
import IssuelibraryCard from "./Components/AdminPanel/IssuelibraryCard.jsx";
import AddNewBook from "./Components/AdminPanel/AddNewBook.jsx";
import EditBook from "./Components/AdminPanel/EditBook.jsx";
import { GoogleOAuthProvider} from "@react-oauth/google";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/books",
        element: <Books />,
      },
      {
        path: "/about",
        element: <About />,
      },
      // Admin routes wrapped in Dashboard layout
      {
        path: "/dashboard",
        element: <Dashboard />,
        children: [
          // Use relative paths for child routes
          {
            path: "users",
            element: <Users />,
          },
          {
            path: "index",
            element: <Front />,
          },
          {
            path: "issuebook",
            element: <IssueBooks />,
          },
          {
            path: "editbook/:id",
            element: <EditBook />,
          },
          {
            path: "managebook",
            element: <ManageBooks />,
          },
          {
            path: "managecategories",
            element: <ManageCategories />,
          },
          {
            path: "returnbook",
            element: <ReturnBooks />,
          },
          {
            path: "penaltymanagement",
            element: <PenaltiesManagement />,
          },
          {
            path: "issuelibrarycard",
            element: <IssuelibraryCard />,
          },
          {
            path: "setting",
            element: <Setting />,
          },
          {
            path: "addnewbook",
            element: <AddNewBook />,
          },
        ],
      },
    ],
  },
]);
const clientId =
"1077343689066-2adoi76us0mt4fhu29r42ar93tf129m7.apps.googleusercontent.com";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <Toaster/>
        <RouterProvider router={router} />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
