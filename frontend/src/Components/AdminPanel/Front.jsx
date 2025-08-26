import React from "react";

const Front = () => {
  return (
    <div>
    
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-9 px-6">
        {/* Orders Card */}
        <div className="flex items-center p-6 bg-white rounded-2xl">
          <div className="flex items-center justify-center w-20 h-20 rounded-lg bg-blue-100 text-4xl">
            📦
          </div>
          <div className="ml-6">
            <h3 className="text-2xl font-semibold text-gray-800">1</h3>
            <p className="text-gray-600">Orders</p>
          </div>
        </div>

        {/* Users Card */}
        <div className="flex items-center p-6 bg-white rounded-2xl">
          <div className="flex items-center justify-center w-20 h-20 rounded-lg bg-yellow-100 text-4xl">
            👥
          </div>
          <div className="ml-6">
            <h3 className="text-2xl font-semibold text-gray-800">3</h3>
            <p className="text-gray-600">Users</p>
          </div>
        </div>

        <div className="flex items-center p-6 bg-white rounded-2xl">
          <div className="flex items-center justify-center w-20 h-20 rounded-lg bg-orange-100 text-4xl">
            💵
          </div>
          <div className="ml-6">
            <h3 className="text-2xl font-semibold text-gray-800">Rs: 200/-</h3>
            <p className="text-gray-600">Total Sales</p>
          </div>
        </div>
      </div>
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <table className="w-full bg-white shadow rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">User</th>
              <th className="py-2 px-4 text-left">Date Order</th>
              <th className="py-2 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="py-2 px-4 flex items-center">
                <img
                  src="https://via.placeholder.com/40"
                  alt="User"
                  className="w-8 h-8 rounded-full mr-3"
                />
                Sujal
              </td>
              <td className="py-2 px-4">2024-05-25 19:26:39</td>
              <td className="py-2 px-4 text-blue-500">Completed</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Front;
