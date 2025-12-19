import React, { useContext } from "react";
import { NavLink } from "react-router";
import { AuthContext } from "../../../context/AuthContext";

const DashboardAside = () => {
  const { role } = useContext(AuthContext);

  return (
    <aside className="w-64 min-h-screen bg-gray-800 text-white p-5">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>

      {/* ================= DONOR MENU ================= */}
      {role === "donor" && (
        <>
          <NavLink to="/dashboard" className="block mb-3">
            🏠 Dashboard Home
          </NavLink>

          <NavLink to="/dashboard/my-donation-requests" className="block mb-3">
            🩸 My Donation Requests
          </NavLink>

          <NavLink to="/dashboard/create-donation-request" className="block mb-3">
            ➕ Create Donation Request
          </NavLink>
        </>
      )}

      {/* ================= ADMIN MENU ================= */}
      {role === "admin" && (
        <>
          <NavLink to="/dashboard" className="block mb-3">
            🏠 Dashboard Home
          </NavLink>

          <NavLink to="/dashboard/all-users" className="block mb-3">
            👤 All Users
          </NavLink>

          <NavLink to="/dashboard/all-blood-donation-request" className="block mb-3">
            🩸 All Blood Donation Requests
          </NavLink>
        </>
      )}

      {/* ================= VOLUNTEER MENU ================= */}
      {role === "volunteer" && (
        <>
          <NavLink to="/dashboard" className="block mb-3">
            🏠 Dashboard Home
          </NavLink>

          <NavLink to="/dashboard/all-blood-donation-request" className="block mb-3">
            🩸 All Blood Donation Requests
          </NavLink>
        </>
      )}
    </aside>
  );
};

export default DashboardAside;
