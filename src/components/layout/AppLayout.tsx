// src/components/layout/AppLayout.tsx
import React from 'react';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        {/* Gunakan variabel CSS untuk warna latar belakang */}
        <main className="flex-1 p-6 overflow-y-auto bg-[var(--color-bg)]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;