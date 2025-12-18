import React from 'react';
import { Outlet } from 'react-router';
import DashboardAside from '../pages/Shared/Aside/DashboardAside';


const DashboardLayout = () => {
    return (
         <div className="flex min-h-screen">
      
      {/* Aside */}
      <DashboardAside></DashboardAside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
    );
};

export default DashboardLayout;