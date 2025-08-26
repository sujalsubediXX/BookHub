import React, { useState } from "react";

const IssuelibraryCard = () => {
  // Sample users data
  const [users, setUsers] = useState([
    {
      id: "U12345",
      name: "John Doe",
      email: "john.doe@example.com",
      image: null,
      issuedDate: null,
      expiryDate: null,
      status: "Inactive",
    },
    {
      id: "U67890",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      image: null,
      issuedDate: null,
      expiryDate: null,
      status: "Inactive",
    },
    // Add more users as needed
  ]);

  const [notification, setNotification] = useState("");

  const handleIssueCard = (userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              issuedDate: new Date().toISOString(),
              expiryDate: new Date(
                new Date().setFullYear(new Date().getFullYear() + 1)
              ).toISOString(),
              status: "Active",
            }
          : user
      )
    );
    const user = users.find((u) => u.id === userId);
    setNotification(`Library card successfully issued to ${user.name}.`);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  return (
    <div className="min-h-[90vh] bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Users Applying for Library Cards
      </h1>
      {notification && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {notification}
        </div>
      )}
      <table className="table-auto border-collapse border border-gray-300 bg-white shadow-md rounded-lg w-full max-w-4xl">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Issued Date</th>
            <th className="border border-gray-300 px-4 py-2">Expiry Date</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{user.id}</td>
              <td className="border border-gray-300 px-4 py-2 flex items-center">
                <img
                  src={user.image || "https://via.placeholder.com/40"}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full mr-2"
                />
                {user.name}
              </td>
              <td className="border border-gray-300 px-4 py-2">{user.email}</td>
              <td className="border border-gray-300 px-4 py-2">
                {formatDate(user.issuedDate)}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {formatDate(user.expiryDate)}
              </td>
              <td className="border border-gray-300 px-4 py-2">{user.status}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  className={`px-3 py-1 text-white rounded-md ${
                    user.status === "Active"
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                  onClick={() => handleIssueCard(user.id)}
                  disabled={user.status === "Active"}
                >
                  {user.status === "Active" ? "Issued" : "Issue Card"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IssuelibraryCard;
