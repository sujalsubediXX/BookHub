import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiArrowUpRight, FiBookOpen, FiUsers, FiLayers, FiAlertCircle } from "react-icons/fi";

function Front() {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:3000/books").then((response) => setBooks(response.data)).catch(() => setBooks([]));
    axios.get("http://localhost:3000/user/info").then((response) => setUsers(response.data)).catch(() => setUsers([]));
  }, []);
  const available = books.reduce((total, book) => total + Number(book.availableCopies || 0), 0);
  const total = books.reduce((sum, book) => sum + Number(book.totalCopies || 0), 0);
  const cards = [["Titles in catalog", books.length, FiBookOpen], ["Copies on shelf", available, FiLayers], ["Registered members", users.length, FiUsers], ["Low availability", books.filter((book) => book.availableCopies < 2).length, FiAlertCircle]];
  return <main className="page-frame"><div className="flex flex-wrap items-end justify-between gap-6"><div><p className="eyebrow">Good morning, librarian</p><h2 className="display-font mt-3 text-5xl">The desk at a glance.</h2><p className="mt-3 text-[#647068]">A live view of your collection and the people using it.</p></div><Link to="/dashboard/addnewbook" className="primary-action">Add a new title <FiArrowUpRight /></Link></div><div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value, EntryIcon]) => <div key={label} className="soft-panel p-5">{React.createElement(EntryIcon, { className: "text-[#b36124]", size: 21 })}<p className="mono-font mt-8 text-[11px] uppercase tracking-wider text-[#8b938d]">{label}</p><p className="display-font mt-2 text-4xl">{value}</p></div>)}</div><div className="mt-10 grid gap-5 lg:grid-cols-[1.3fr_.7fr]"><section className="soft-panel p-6"><div className="flex items-center justify-between"><div><p className="eyebrow">Inventory health</p><h3 className="display-font mt-2 text-2xl">Shelf availability</h3></div><span className="mono-font text-xs text-[#8b938d]">{available} / {total} copies</span></div><div className="mt-8 h-3 bg-[#e5dfd3]"><div className="h-3 bg-[#b36124]" style={{ width: `${total ? Math.min((available / total) * 100, 100) : 0}%` }} /></div><p className="mt-4 text-sm text-[#647068]">{total ? Math.round((available / total) * 100) : 0}% of the collection is currently available to issue.</p></section><section className="bg-[#20302a] p-6 text-[#f5f1e8]"><p className="eyebrow text-[#efb27b]">Quick action</p><h3 className="display-font mt-3 text-3xl">Move a book from shelf to reader.</h3><Link to="/dashboard/issuebook" className="mt-8 inline-flex items-center gap-2 text-[#efb27b]">Issue a book <FiArrowUpRight /></Link></section></div></main>;
}

export default Front;
