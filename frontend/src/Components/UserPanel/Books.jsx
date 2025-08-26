import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
function Books() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayBooks, setDisplayBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(""); // Track selected genre
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const booksPerPage = 8;
  const [genre, setGenre] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:3000/books");
        setBooks(res.data);
      } catch (error) {
        console.error(`Fetch books error: ${error.message}`);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    const getGenre = async () => {
      try {
        const res = await axios.get("http://localhost:3000/genre");
        setGenre(res.data);
      } catch (error) {
        console.error(`Fetch genres error: ${error.message}`);
      }
    };
    getGenre();
  }, []);

  // Get genreId from URL params if present
  const searchParams = new URLSearchParams(location.search);
  const genreIdFromUrl = searchParams.get("genreid");

  useEffect(() => {
    const filteredBooks = books.filter((book) => {
      const matchesSearchTerm = book.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesGenre =
        !selectedGenre && !genreIdFromUrl
          ? true
          : selectedGenre
          ? book.genre.some((g) => g._id === selectedGenre)
          : genreIdFromUrl
          ? book.genre.some((g) => g._id === genreIdFromUrl)
          : false;
      return matchesSearchTerm && matchesGenre;
    });

    setDisplayBooks(filteredBooks);
    setCurrentPage(1); // Reset to the first page whenever filtering is applied
  }, [books, selectedGenre, searchTerm, genreIdFromUrl]);

  // Handle sorting books
  const handleSort = (sortBy) => {
    const sorted = [...displayBooks].sort((a, b) => {
      const aValue = a[sortBy]?.toLowerCase();
      const bValue = b[sortBy]?.toLowerCase();
      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
      return 0;
    });
    setDisplayBooks(sorted);
    setCurrentPage(1);
  };

  // Handle sort change
  const handleSortChange = (event) => {
    handleSort(event.target.value);
  };

  // Handle genre change (update state and URL)
  const handleGenreChange = (event) => {
    const selected = event.target.value;
    setSelectedGenre(selected);
    // Update URL with the selected genre
    if (selected) {
      navigate(`?genreid=${selected}`);
    } else {
      navigate("/books");
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = displayBooks.slice(indexOfFirstBook, indexOfLastBook);

  const totalPages = Math.ceil(displayBooks.length / booksPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const openModal = (book) => {
    setSelectedBook(book);
  };

  const closeModal = () => {
    setSelectedBook(null);
  };

  return (
    <>
      <div className="pt-6 mx-auto bg-gray-100">
        <div className="text-center mb-[30px]">
          <label htmlFor="genre-filter" className="mr-[10px]">
            Genre:
          </label>
          <select
            id="genre-filter"
            className="p-[10px] text-[16px] mr-5 rounded-lg"
            onChange={handleGenreChange}
            value={selectedGenre || genreIdFromUrl || ""}
          >
            <option value="">ALL</option>
            {/* <option value=""><Link 
            to="/">ALL</Link></option> */}
            {genre.map((setgenre) => (
              <option key={setgenre._id} value={setgenre._id}>
                {setgenre.name}
              </option>
            ))}
          </select>
          <label htmlFor="sort-by" className="mr-[10px]">
            Sort By:
          </label>
          <select
            id="sort-by"
            className="p-[10px] text-[16px] mr-5 rounded-lg"
            onChange={handleSortChange}
            defaultValue="none"
          >
            <option value="none">None</option>
            <option value="title">Title</option>
            <option value="author">Author</option>
          </select>
          <label htmlFor="search" className="mr-[10px]">
            Search:
          </label>
          <input
            id="search"
            type="text"
            className="p-[10px] text-[16px] rounded-lg"
            placeholder="Search books..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex flex-wrap gap-[14px] justify-center">
          {currentBooks.length > 0 ? (
            currentBooks.map((book) => (
              <div
                key={book._id}
                className="flex bg-[#fff] border border-solid border-[#ddd] rounded-xl p-4 w-[336px] h-[180px] text-center cursor-pointer shadow-md transform hover:scale-105"
                onClick={() => openModal(book)}
              >
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-[44%] h-[148px] rounded-[10px] mb-0"
                />
                <div className="text-left py-0 pl-[14px]">
                  <h2 className="boldtitle text-[13px] text-black mb-[6px] font-bold">
                    {book.title}
                  </h2>
                  <p className="text-[12px] text-[rgb(81,80,80)] mb-[3px]">
                    <span className="boldtitle font-bold">Author: </span>
                    {book.author}
                  </p>
                  <p className="text-[12px] text-[rgb(81,80,80)] mb-[3px]">
                    <span className="boldtitle font-bold">Genre: </span>
                    {book.genre.map((g) => g.name).join(", ")}
                  </p>
                  <p className="text-[12px] text-[rgb(81,80,80)] mb-[3px]">
                    <span className="boldtitle font-bold">ISBN: </span>
                    {book.isbn}
                  </p>
                  <button
                    className="btn py-[6px] px-3 text-[16px] mt-1 border-2 border-solid border-black bg-[#ea00ff] text-[#fff] rounded-[5px] cursor-pointer hover:bg-[#b300aa] hover:border-black"
                    onClick={() => openModal(book)}
                  >
                    Show More
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-4xl text-red-500  flex justify-center items-center h-[16.9vh]"><span>No Books Found.</span></p>
          )}
        </div>
        <div className="flex justify-center mt-5 pb-5">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`my-0 mx-[5px] py-[10px] px-4 border border-solid border-[#ccc] ${
                currentPage === index + 1
                  ? "bg-[#007bff] text-white"
                  : "bg-[#f9f9f9] text-black"
              } cursor-pointer hover:bg-[#ddd]`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      {selectedBook && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeModal}
          ></div>
          <dialog
            open
            className="modal modal-bottom sm:modal-middle z-50 overflow-hidden"
          >
            <div className="modal-box p-0 w-full h-[50%] sm:max-w-[50rem] flex overflow-hidden">
              <div className="h-full w-1/2">
                <img
                  src={selectedBook.image}
                  alt={selectedBook.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 w-1/2">
                <h2 className="text-xl font-bold mb-2">
                  {selectedBook.title}
                </h2>
                <p className="mb-1">
                  <strong>Author:</strong> {selectedBook.author}
                </p>
                <p className="mb-1">
                  <strong>ISBN:</strong> {selectedBook.isbn}
                </p>
                <p className="mb-1">
                  <strong>Genre:</strong>{" "}
                  {selectedBook.genre.map((g) => g.name).join(", ")}
                </p>
                <p className="mb-1">
                  <strong>Publish Date:</strong>{new Date(selectedBook.publishedDate).toISOString().split("T")[0]}
                </p>
                <p>
                  <strong>Details:</strong> {selectedBook.description}
                </p>
              </div>
              <button
                className="btn btn-error btn-sm absolute right-2 top-2"
                onClick={closeModal}
              >
                ✕
              </button>
            </div>
          </dialog>
        </>
      )}
    </>
  );
}

export default Books;
