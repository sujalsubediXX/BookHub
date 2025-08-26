import React from "react";

const PenaltiesManagement = () => {
  const penalties = [
    { id: 1, user: "John Doe", book: "Book A", dueDate: "2024-11-01", returnDate: "2024-11-10", penalty: 50 },
    { id: 2, user: "Jane Smith", book: "Book B", dueDate: "2024-11-05", returnDate: "2024-11-15", penalty: 30 },
  ];

  // Function to export penalties as CSV
  const exportPenaltyReport = () => {
    const headers = ["User ID,User Name,Book Title,Due Date,Return Date,Penalty Amount"];
    const rows = penalties.map(
      (penalty) =>
        `${penalty.id},${penalty.user},${penalty.book},${penalty.dueDate},${penalty.returnDate},${penalty.penalty}`
    );

    // Combine headers and rows
    const csvContent = [headers.join("\n"), rows.join("\n")].join("\n");

    // Create a Blob for CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Create download link
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "penalty_report.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);

    // Trigger download
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-gray-100 h-[90vh] overflow-auto">
      <h1 className="text-2xl font-bold mb-4">Penalty Management</h1>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by user name or book title"
          className="border p-2 rounded-md w-1/3"
        />
        <button
          onClick={exportPenaltyReport}
          className="bg-blue-600 text-white py-2 px-4 rounded-md"
        >
          Export Report
        </button>
      </div>

      <table className="w-full bg-white border rounded-md">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 border">User ID</th>
            <th className="p-3 border">User Name</th>
            <th className="p-3 border">Book Title</th>
            <th className="p-3 border">Due Date</th>
            <th className="p-3 border">Return Date</th>
            <th className="p-3 border">Penalty Amount</th>
          </tr>
        </thead>
        <tbody>
          {penalties.map((penalty) => (
            <tr key={penalty.id} className="text-center">
              <td className="p-3 border">{penalty.id}</td>
              <td className="p-3 border">{penalty.user}</td>
              <td className="p-3 border">{penalty.book}</td>
              <td className="p-3 border">{penalty.dueDate}</td>
              <td className="p-3 border">{penalty.returnDate}</td>
              <td className="p-3 border text-red-600 font-bold">${penalty.penalty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};



export default PenaltiesManagement
