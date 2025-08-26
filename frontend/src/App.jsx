import React from 'react';
import Header from './Components/UserPanel/Header';
import Footer from './Components/UserPanel/Footer';
import { Outlet, useLocation } from 'react-router-dom';
// import toast, { Toaster } from 'react-hot-toast';

function App() {
  const location = useLocation();
    return (
    <>
      {!location.pathname.startsWith('/login') && 
       !location.pathname.startsWith('/register') && 
       !location.pathname.startsWith('/dashboard') && 
       <Header />}
      <Outlet />
     
      {!location.pathname.startsWith('/login') && 
       !location.pathname.startsWith('/register') && 
       !location.pathname.startsWith('/dashboard') && !location.pathname.startsWith('/profile') &&
       <Footer />}
    </>
  );
}

export default App;
