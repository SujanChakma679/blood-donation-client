


import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import VolunteerDashboard from "./VolunteerDashboard";
import DonorDashboard from "./DonorDashboard";


const Dashboard = () => {
  const { user, role, loading } = useContext(AuthContext);

  if (loading) {
    return <p className="p-6">Loading dashboard...</p>;
  }

  if (!user) {
    return <p className="p-6 text-red-500">User not logged in</p>;
  }

  // 🔁 ROLE BASED RENDERING
  if (role === "admin") {
    return <AdminDashboard />;
  }

  if (role === "volunteer") {
    return <VolunteerDashboard />;
  }

  // default donor
  return <DonorDashboard />;
};

export default Dashboard;
