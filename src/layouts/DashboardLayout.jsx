import React from 'react';
import { Outlet } from 'react-router';
import DashboardAside from '../pages/Shared/Aside/DashboardAside';
import Navbar from '../pages/Shared/Navbar/Navbar';


const DashboardLayout = () => {
    return (
         <div>
            <Navbar></Navbar>
            <div className="flex min-h-screen">
      
      {/* Aside */}
      <DashboardAside></DashboardAside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
         </div>
    );
};

export default DashboardLayout;