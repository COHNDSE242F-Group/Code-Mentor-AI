import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
const Layout: React.FC = () => {
  return <div className="flex flex-col min-h-screen bg-slate-900">
      <Navbar />
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>;
};
export default Layout;