import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({
  children
}) => {
  return <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden min-h-0">
        <TopBar />
        <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>;
};
export default Layout;