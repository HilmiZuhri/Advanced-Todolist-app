// src/components/layout/AppLayout.tsx
import React, { useState, useEffect } from 'react';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State untuk mengontrol sidebar

  // Tutup sidebar saat beralih ke ukuran layar yang lebih besar
  useEffect(() => {
    const handleResize = () => {
      // Jika lebar viewport >= 1024px (breakpoint 'lg' di Tailwind), pastikan sidebar terbuka
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        // Jika lebih kecil dari 'lg', tutup sidebar (jika sebelumnya terbuka)
        setIsSidebarOpen(false);
      }
    };

    // Panggil saat mount
    handleResize();

    // Tambahkan event listener
    window.addEventListener('resize', handleResize);

    // Bersihkan event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Hanya jalankan sekali saat mount

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar onToggleSidebar={toggleSidebar} /> {/* Teruskan fungsi toggle ke Topbar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} /> {/* Teruskan state dan fungsi ke Sidebar */}
        {/* Overlay untuk saat sidebar terbuka di mobile */}
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