import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { FiBookOpen, FiSearch, FiX } from "react-icons/fi";

function Books() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [query, setQuery] = useState("");
  const [genreId, setGenreId] = useState("");
  const [sort, setSort] = useState("title");
  const [selectedBook, setSelectedBook] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setGenreId(params.get("genreid") || "");
    axios.get("http://localhost:3000/books").then((response) => setBooks(response.data)).catch(() => setBooks([]));
    axios.get("http://localhost:3000/genre").then((response) => setGenres(response.data)).catch(() => setGenres([]));
  }, [location.search]);

  const filteredBooks = useMemo(() => books.filter((book) => {
    const text = `${book.title} ${book.author} ${book.isbn}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (!genreId || book.genre?.some((genre) => genre._id === genreId));
  }).sort((a, b) => (a[sort] || "").localeCompare(b[sort] || "")), [books, genreId, query, sort]);

  const updateGenre = (value) => { setGenreId(value); navigate(value ? `/books?genreid=${value}` : "/books"); };
  const coverUrl = (image) => image?.startsWith("http") ? image : `http://localhost:3000${image?.replace(".", "") || ""}`;

  return <main className="public-shell"><div className="page-frame">
    <div className="flex flex-wrap items-end justify-between gap-6"><div><p className="eyebrow">The open shelves</p><h1 className="display-font mt-3 text-5xl">Catalog</h1><p className="mt-3 max-w-xl text-[#647068]">Search the collection, filter by genre, and open a title for its full record.</p></div><div className="mono-font text-xs text-[#8b938d]">{filteredBooks.length.toString().padStart(2, "0")} TITLES FOUND</div></div>
    <div className="mt-12 grid gap-3 border-y border-[#d9d3c7] py-4 md:grid-cols-[1fr_180px_160px]"><label className="relative"><FiSearch className="absolute left-3 top-3 text-[#b36124]" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full border border-[#cfc8ba] bg-[#fbf9f4] py-2.5 pl-10 pr-3 outline-none focus:border-[#b36124]" placeholder="Search title, author, or ISBN" /></label><select value={genreId} onChange={(event) => updateGenre(event.target.value)} className="border border-[#cfc8ba] bg-[#fbf9f4] px-3 py-2.5 outline-none"><option value="">All genres</option>{genres.map((genre) => <option key={genre._id} value={genre._id}>{genre.name}</option>)}</select><select value={sort} onChange={(event) => setSort(event.target.value)} className="border border-[#cfc8ba] bg-[#fbf9f4] px-3 py-2.5 outline-none"><option value="title">Sort: title</option><option value="author">Sort: author</option></select></div>
    {filteredBooks.length ? <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">{filteredBooks.map((book) => <article key={book._id} className="group cursor-pointer" onClick={() => setSelectedBook(book)}><div className="book-cover aspect-[3/4] border border-[#d9d3c7] p-2 transition-transform group-hover:-translate-y-1"><img src={coverUrl(book.image)} alt={book.title} /></div><div className="pt-4"><p className="mono-font text-[10px] uppercase tracking-wider text-[#b36124]">{book.genre?.[0]?.name || "Collection"}</p><h2 className="mt-1 text-lg font-semibold leading-tight">{book.title}</h2><p className="mt-1 text-sm text-[#647068]">{book.author}</p><p className="mt-3 text-xs text-[#8b938d]">{book.availableCopies > 0 ? `${book.availableCopies} available` : "Currently unavailable"}</p></div></article>)}</div> : <div className="soft-panel flex min-h-64 flex-col items-center justify-center p-8 text-center"><FiBookOpen size={30} className="text-[#b36124]" /><h2 className="display-font mt-4 text-2xl">No titles match that search.</h2><button className="quiet-action mt-4" onClick={() => { setQuery(""); updateGenre(""); }}>Clear filters</button></div>}
  </div>{selectedBook && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#20302a]/70 p-4" onClick={() => setSelectedBook(null)}><div className="grid max-h-[90vh] w-full max-w-3xl overflow-auto bg-[#fbf9f4] md:grid-cols-2" onClick={(event) => event.stopPropagation()}><div className="book-cover min-h-80"><img src={coverUrl(selectedBook.image)} alt={selectedBook.title} /></div><div className="relative p-8"><button className="absolute right-4 top-4 border-0 bg-transparent text-xl text-[#647068]" onClick={() => setSelectedBook(null)} aria-label="Close"><FiX /></button><p className="eyebrow">Book record</p><h2 className="display-font mt-4 text-4xl">{selectedBook.title}</h2><p className="mt-2 text-[#647068]">by {selectedBook.author}</p><div className="my-7 border-y border-[#d9d3c7] py-5 text-sm leading-7 text-[#45554d]"><p><strong>ISBN</strong> {selectedBook.isbn}</p><p><strong>Genre</strong> {selectedBook.genre?.map((genre) => genre.name).join(", ")}</p><p><strong>Availability</strong> {selectedBook.availableCopies} of {selectedBook.totalCopies} copies</p></div><p className="leading-7 text-[#647068]">{selectedBook.description}</p></div></div></div>}</main>;
}

export default Books;
