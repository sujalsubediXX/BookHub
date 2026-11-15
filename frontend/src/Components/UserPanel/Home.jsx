import React from "react";
import heroimg from "../../images/heroimg.jpeg";
import { Link } from "react-router-dom";
import { FiArrowUpRight, FiBookOpen, FiClock, FiUsers } from "react-icons/fi";
function Home() {

  return (
    <main className="public-shell">
      <section className="page-frame grid items-center gap-12 pb-20 pt-16 lg:grid-cols-[1.05fr_.95fr] lg:pt-24">
        <div>
          <p className="eyebrow">A better way to browse</p>
          <h1 className="display-font mt-5 max-w-3xl text-5xl leading-[1.04] text-[#20302a] sm:text-7xl">Good books deserve a place to be found.</h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#647068]">BookHub brings the shelves, librarians, and reading community into one calm, useful space.</p>
          <div className="mt-9 flex flex-wrap gap-3"><Link to="/books" className="primary-action">Explore the catalog <FiArrowUpRight /></Link><Link to="/about" className="quiet-action">How BookHub works</Link></div>
          <div className="mt-14 grid max-w-xl grid-cols-3 gap-5 border-t border-[#d9d3c7] pt-5 text-sm text-[#647068]"><span><FiBookOpen className="mb-2 text-[#b36124]" size={20} /><strong className="block text-2xl text-[#20302a]">1,200+</strong> titles to discover</span><span><FiUsers className="mb-2 text-[#b36124]" size={20} /><strong className="block text-2xl text-[#20302a]">24/7</strong> online access</span><span><FiClock className="mb-2 text-[#b36124]" size={20} /><strong className="block text-2xl text-[#20302a]">Simple</strong> lending records</span></div>
        </div>
        <div className="relative min-h-[430px] overflow-hidden bg-[#2c3c34] p-5 sm:p-8"><div className="absolute inset-0 bg-[#20302a]/25" /><img src={heroimg} alt="A reader browsing a library shelf" className="relative h-[430px] w-full object-cover opacity-85" /><div className="absolute bottom-10 left-10 max-w-xs border border-white/40 bg-[#20302a]/85 p-5 text-white"><p className="eyebrow text-[#efb27b]">This month's note</p><p className="display-font mt-2 text-2xl">Make room for a book you did not plan to read.</p></div></div>
      </section>
      <section className="border-y border-[#d9d3c7] bg-[#ebe5d9]"><div className="page-frame grid gap-8 py-14 md:grid-cols-3"><div><p className="eyebrow">Built for real libraries</p><h2 className="display-font mt-3 text-3xl">From shelf to circulation.</h2></div><div><h3 className="font-semibold">For readers</h3><p className="mt-2 leading-7 text-[#647068]">Search by title, author, genre, or availability, then keep your reading history close.</p></div><div><h3 className="font-semibold">For librarians</h3><p className="mt-2 leading-7 text-[#647068]">Manage inventory, categories, users, and lending activity from one focused console.</p></div></div></section>
      <section className="page-frame grid gap-10 py-20 md:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Start somewhere</p><h2 className="display-font mt-3 text-4xl">Your next favorite shelf is waiting.</h2><Link to="/books" className="mt-7 inline-flex items-center gap-2 text-[#b36124]">View all books <FiArrowUpRight /></Link></div><div className="grid grid-cols-2 gap-4"><div className="soft-panel p-6"><span className="mono-font text-xs text-[#b36124]">01 / DISCOVER</span><h3 className="display-font mt-10 text-2xl">Find a story with a little patience.</h3></div><div className="bg-[#20302a] p-6 text-[#f5f1e8]"><span className="mono-font text-xs text-[#efb27b]">02 / RETURN</span><h3 className="display-font mt-10 text-2xl">Keep your reading life in motion.</h3></div></div></section>
    </main>
  );
}

export default Home;
