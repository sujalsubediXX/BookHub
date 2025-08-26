import React from 'react'

const ReturnBooks = () => {

    const books = [
      { id: 1, title: "Book A", issueDate: "2024-10-10", dueDate: "2024-10-20", status: "Pending" },
      { id: 2, title: "Book B", issueDate: "2024-09-15", dueDate: "2024-09-25", status: "Returned" },
    ];
  
    // Function to export data as CSV
    const exportReport = () => {
      const headers = ["Book ID,Book Title,Issued Date,Due Date,Status"];
      const rows = books.map(
        (book) => `${book.id},${book.title},${book.issueDate},${book.dueDate},${book.status}`
      );
  
      // Combine headers and rows
      const csvContent = [headers.join("\n"), rows.join("\n")].join("\n");
  
      // Create a Blob object for CSV content
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  
      // Create a download link
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "return_books_report.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
  
      // Trigger download
      link.click();
  
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };
  
    return (
      <div className="p-6 bg-gray-100 h-[90vh] overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Return Books</h1>
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search by title or ID"
            className="border p-2 rounded-md w-1/3"
          />
          <button
            onClick={exportReport}
            className="bg-blue-600 text-white py-2 px-4 rounded-md"
          >
            Export Report
          </button>
        </div>
  
        <table className="w-full bg-white border rounded-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 border">Book ID</th>
              <th className="p-3 border">Book Title</th>
              <th className="p-3 border">Issued Date</th>
              <th className="p-3 border">Due Date</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="text-center">
                <td className="p-3 border">{book.id}</td>
                <td className="p-3 border">{book.title}</td>
                <td className="p-3 border">{book.issueDate}</td>
                <td className="p-3 border">{book.dueDate}</td>
                <td className="p-3 border">{book.status}</td>
                <td className="p-3 border">
                  {book.status === "Pending" ? (
                    <button className="bg-green-500 text-white px-3 py-1 rounded-md">
                      Return
                    </button>
                  ) : (
                    <span className="text-gray-500">Returned</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  
export default ReturnBooks
