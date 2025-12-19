import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const { user } = useContext(AuthContext);

  useEffect(() => {
    axios.get("http://localhost:5000/admin-stats")
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
         Welcome, {user?.displayName || "Admin"}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow p-6">
          <h2 className="text-lg font-semibold">Total Donors</h2>
          <p className="text-3xl font-bold">{stats.totalUsers || 0}</p>
        </div>

        <div className="card bg-base-100 shadow p-6">
          <h2 className="text-lg font-semibold">Total Funds</h2>
          <p className="text-3xl font-bold">${stats.totalFunds || 0}</p>
        </div>

        <div className="card bg-base-100 shadow p-6">
          <h2 className="text-lg font-semibold">Blood Requests</h2>
          <p className="text-3xl font-bold">{stats.totalRequests || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
