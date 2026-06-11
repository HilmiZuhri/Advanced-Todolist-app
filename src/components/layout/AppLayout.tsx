import React, { useState, useEffect } from 'react';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar onToggleSidebar={toggleSidebar} /> 
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
        {isSidebarOpen && window.innerWidth < 1024 && (
          <div
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
            aria-hidden="true"
          ></div>
        )}
        <main
          className={`flex-1 p-4 md:p-6 overflow-y-auto bg-[var(--color-bg)] transition-all duration-300
            ${isSidebarOpen && window.innerWidth < 1024 ? 'ml-64' : 'ml-0'} // Geser konten utama jika sidebar terbuka di mobile
          `}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;