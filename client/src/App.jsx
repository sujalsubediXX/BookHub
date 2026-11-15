import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import StoreLayout from './components/StoreLayout.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import Auth from './pages/Auth.jsx';
import Home from './pages/Home.jsx';
import Catalogue from './pages/Catalogue.jsx';
import BookDetail from './pages/BookDetail.jsx';
import MyRentals from './pages/MyRentals.jsx';
import Wishlist from './pages/Wishlist.jsx';
import PaymentResult from './pages/PaymentResult.jsx';
import Profile from './pages/Profile.jsx';
import AdminDashboard from './pages/admin/Dashboard.jsx';
import AdminRentals from './pages/admin/Rentals.jsx';
import AdminBooks from './pages/admin/Books.jsx';
import AdminInventory from './pages/admin/Inventory.jsx';
import AdminGenres from './pages/admin/Genres.jsx';
import AdminCustomers from './pages/admin/Customers.jsx';
import AdminStaff from './pages/admin/Staff.jsx';

// kind: 'user' (any logged in) | 'customer' | 'staff' | 'admin'; perm optional
function Guard({ kind = 'user', perm }) {
  const { user, loading, can } = useAuth();
  const loc = useLocation();
  if (loading) return <div className="splash">Loading…</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname + loc.search }} />;
  const staff = user.role !== 'customer';
  const ok = kind === 'user' || (kind === 'customer' && !staff) || (kind === 'staff' && staff) || (kind === 'admin' && user.role === 'admin');
  if (!ok || (perm && !can(perm))) return <Navigate to={staff ? '/admin' : '/'} replace />;
  return <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/register" element={<Auth mode="register" />} />

        <Route element={<StoreLayout />}>
          <Route index element={<Home />} />
          <Route path="books" element={<Catalogue />} />
          <Route path="books/:id" element={<BookDetail />} />
          <Route element={<Guard kind="customer" />}>
            <Route path="my-rentals" element={<MyRentals />} />
            <Route path="wishlist" element={<Wishlist />} />
          </Route>
          <Route element={<Guard />}>
            <Route path="profile" element={<Profile />} />
            <Route path="payment/result" element={<PaymentResult />} />
          </Route>
        </Route>

        <Route element={<Guard kind="staff" />}>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route element={<Guard kind="staff" perm="rentals" />}><Route path="rentals" element={<AdminRentals />} /></Route>
            <Route element={<Guard kind="staff" perm="books" />}>
              <Route path="books" element={<AdminBooks />} />
              <Route path="inventory" element={<AdminInventory />} />
              <Route path="genres" element={<AdminGenres />} />
            </Route>
            <Route element={<Guard kind="staff" perm="members" />}><Route path="customers" element={<AdminCustomers />} /></Route>
            <Route element={<Guard kind="admin" />}><Route path="staff" element={<AdminStaff />} /></Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
