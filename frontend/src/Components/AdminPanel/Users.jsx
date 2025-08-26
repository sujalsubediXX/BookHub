import React, { useEffect, useState } from "react";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchuser, setSearchuser] = useState("");

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await axios.get("http://localhost:3000/user/info");
        setUsers(user.data);
      } catch (error) {
        console.error(`Fetching user error: ${error.message}`);
      }
    };
    getUser();
  }, []);

  const handleSearchUser = (e) => {
    setSearchuser(e.target.value.toLowerCase());
  };

  // Filter users based on the search query
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchuser) ||
    user.email.toLowerCase().includes(searchuser) ||
    user.status.toLowerCase().includes(searchuser) ||
    user.role.toLowerCase().includes(searchuser)
  );

  return (
    <div className="p-6 bg-gray-50 h-[90vh]">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">User Management</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
        <FaSearch className="absolute left-3 top-[.8rem] text-gray-500" />
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
            onChange={handleSearchUser}
          />
        </div>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600"
          onClick={() => alert("Add User Modal")}
        >
          Add User
        </button>
      </div>
      <table className="w-full border-collapse bg-white shadow-md rounded-lg">
        <thead className="bg-blue-100 text-gray-600">
          <tr>
            <th className="p-3 border">ID</th>
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">Status</th>
            <th className="p-3 border">Role</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={user.id} className="text-center text-gray-700">
              <td className="p-3 border">{index + 1}</td>
              <td className="p-3 border">{user.username}</td>
              <td className="p-3 border">{user.email}</td>
              <td className="p-3 border">{user.status}</td>
              <td className="p-3 border">{user.role}</td>
              <td className="p-3 border flex justify-center space-x-2">
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => handleEdit(user.id)}
                >
                  <FaEdit />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(user.id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
