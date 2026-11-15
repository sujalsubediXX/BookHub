import React, { useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiBookOpen, FiChevronLeft, FiGrid, FiLogOut, FiMenu, FiTag, FiUsers, FiRepeat, FiAlertCircle, FiSettings } from "react-icons/fi";

const items = [
  ["/dashboard/index", "Overview", FiGrid],
  ["/dashboard/managebook", "Catalog", FiBookOpen],
  ["/dashboard/issuebook", "Issue a book", FiRepeat],
  ["/dashboard/returnbook", "Returns", FiRepeat],
  ["/dashboard/users", "Members", FiUsers],
  ["/dashboard/managecategories", "Genres", FiTag],
  ["/dashboard/penaltymanagement", "Penalties", FiAlertCircle],
];

function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const current = items.find(([path]) => location.pathname === path)?.[1] || "Overview";
  const logout = () => { localStorage.removeItem("Users"); toast.success("You have logged out."); navigate("/"); };

  return <div className="min-h-screen bg-[#f5f1e8] text-[#20302a]"><aside className={`${collapsed ? "w-[76px]" : "w-64"} fixed inset-y-0 left-0 z-40 hidden border-r border-[#d9d3c7] bg-[#20302a] text-[#f5f1e8] transition-all lg:block`}><div className="flex h-full flex-col"><div className="flex items-center justify-between border-b border-white/10 p-5"><Link to="/dashboard/index" className="display-font text-xl">{collapsed ? "B" : "BookHub"}</Link><button className="border-0 bg-transparent text-[#c8d0c8]" onClick={() => setCollapsed(!collapsed)} aria-label="Collapse sidebar"><FiChevronLeft className={collapsed ? "rotate-180" : ""} /></button></div><div className="px-4 py-6"><p className={`eyebrow mb-3 text-[#efb27b] ${collapsed ? "hidden" : ""}`}>Library desk</p>{items.map(([path, label, EntryIcon]) => <NavLink key={path} to={path} className={({ isActive }) => `mb-1 flex items-center gap-3 px-3 py-3 text-sm no-underline ${isActive ? "bg-[#b36124] text-white" : "text-[#c8d0c8] hover:bg-white/10"}`}>{React.createElement(EntryIcon, { size: 17 })}<span className={collapsed ? "hidden" : ""}>{label}</span></NavLink>)}</div><div className="mt-auto p-4"><NavLink to="/dashboard/setting" className="mb-1 flex items-center gap-3 px-3 py-3 text-sm text-[#c8d0c8] no-underline hover:bg-white/10"><FiSettings size={17} /><span className={collapsed ? "hidden" : ""}>Settings</span></NavLink><button onClick={logout} className="flex w-full items-center gap-3 border-0 bg-transparent px-3 py-3 text-sm text-[#efb27b] hover:bg-white/10"><FiLogOut size={17} /><span className={collapsed ? "hidden" : ""}>Sign out</span></button></div></div></aside><div className={`${collapsed ? "lg:pl-[76px]" : "lg:pl-64"} min-h-screen transition-all`}><header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#d9d3c7] bg-[#f5f1e8]/95 px-5 py-4 backdrop-blur lg:px-8"><div className="flex items-center gap-4"><button className="quiet-action lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}><FiMenu /></button><div><p className="eyebrow">Staff console</p><h1 className="display-font text-2xl">{current}</h1></div></div><div className="mono-font text-xs text-[#8b938d]">{new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</div></header>{mobileOpen && <div className="fixed inset-0 z-50 bg-[#20302a] p-6 text-[#f5f1e8] lg:hidden"><div className="flex justify-between"><span className="display-font text-xl">BookHub</span><button onClick={() => setMobileOpen(false)} className="border-0 bg-transparent text-2xl">×</button></div><nav className="mt-8">{items.map(([path, label, EntryIcon]) => <NavLink key={path} to={path} onClick={() => setMobileOpen(false)} className="mb-2 flex items-center gap-3 border-b border-white/10 py-4 no-underline">{React.createElement(EntryIcon)}{label}</NavLink>)}</nav></div>}<Outlet /></div></div>;
}

export default Dashboard;
