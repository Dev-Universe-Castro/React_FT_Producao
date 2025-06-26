
    import React from 'react';
    import { Outlet } from 'react-router-dom';
    import Sidebar from '@/components/layout/Sidebar';

    const MainLayout = () => {
      return (
        <div className="flex h-screen bg-gray-800 text-white">
          <Sidebar />
          <main className="flex-1 p-8 overflow-y-auto bg-gray-900">
            <Outlet />
          </main>
        </div>
      );
    };

    export default MainLayout;
  