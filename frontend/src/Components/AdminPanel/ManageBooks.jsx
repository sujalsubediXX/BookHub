import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(""); // State for selected genre
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const itemsPerPage = 10; // Number of items per page

  const handleDeleteBook = async (_id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        const res = await axios.delete(
          `http://localhost:3000/deletebook/${_id}`
        );
        toast.success(res.data.message);
        setBooks((prevBooks) => prevBooks.filter((book) => book._id !== _id));
      } catch (error) {
        console.error(`Unable to delete this book: ${error.message}`);
        toast.error("Failed to delete the book.");
      }
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:3000/books");
        setBooks(res.data);
      } catch (error) {
        console.error(`Fetch books error: ${error.message}`);
        toast.error("Failed to fetch books.");
      }
    };
    fetchBooks();
  }, []);

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value); // Update the selected genre
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase()); // Update the search query
  };

  // Filter books based on selected genre and search query
  const filteredBooks = books.filter((book) => {
    const matchesGenre =
      selectedGenre === "" || book.genre.some((g) => g.name === selectedGenre);
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery) ||
      book.author.toLowerCase().includes(searchQuery) ||
      book.isbn.toLowerCase().includes(searchQuery) ||
      book.genre.some((g) => g.name.toLowerCase().includes(searchQuery));

    return matchesGenre && matchesSearch;
  });

  // Extract unique genres from books
  const uniqueGenres = [
    ...new Set(books.flatMap((book) => book.genre.map((g) => g.name))),
  ];

  // Calculate pagination
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBooks = filteredBooks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="px-6 pt-4 bg-gray-50 h-[91.6vh]">
      <div className="flex justify-between items-center mb-4">
        {/* Search and Genre Filter */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search books..."
              className="pl-10 pr-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
              onChange={handleSearchChange}
            />
            <FaSearch className="absolute left-3 top-[0.8rem] text-gray-500" />
          </div>
          <select
            className="border px-4 py-2 rounded-md shadow-sm focus:ring focus:ring-blue-300"
            onChange={handleGenreChange}
            value={selectedGenre}
          >
            <option value="">All Genres</option>
            {uniqueGenres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
        {/* Add New Book */}
        <Link
          to="/dashboard/addnewbook"
          className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600"
        >
          <FaPlus className="inline-block mr-2" /> Add New Book
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-y-auto max-h-[530px] border rounded-lg shadow-md">
        <table className="w-full border-collapse bg-white">
          <thead className="bg-blue-100 text-gray-600">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Author</th>
              <th className="p-2 border">Genre</th>
              <th className="p-2 border">ISBN</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBooks.map((book, index) => (
              <tr key={book._id} className="text-center text-gray-700">
                <td className="p-2 border">{startIndex + index + 1}</td>
                <td className="p-2 border">{book.title}</td>
                <td className="p-2 border">{book.author}</td>
                <td className="p-2 border">
                  {book.genre.map((g) => g.name).join(", ")}
                </td>
                <td className="p-2 border">{book.isbn}</td>
                <td className="p-2 border flex justify-center space-x-2">
                  <Link
                    to={`/dashboard/editbook/${book._id}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteBook(book._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="my-8 flex justify-center">
        <div className="join">
         
            <button
              className="join-item btn"
              onClick={() => handlePageChange(currentPage === 1 ? currentPage:currentPage - 1)}
            >
              «
            </button>
         
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (num) => (
              <button
                key={num}
                className={`join-item btn ${
                  num === currentPage ? "btn-active" : ""
                }`}
                onClick={() => handlePageChange(num)}
              >
                {num}
              </button>
            )
          )}
            <button
              className="join-item btn"
              onClick={() => handlePageChange(currentPage === totalPages ?currentPage:currentPage + 1)}
            >
              »
            </button>
        </div>
      </div>
    </div>
  );
};

export default ManageBooks;
