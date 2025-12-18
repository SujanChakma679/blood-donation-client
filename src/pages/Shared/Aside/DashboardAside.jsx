import { NavLink } from "react-router";

// TEMP: replace later with real role from DB
const userRole = "donor"; // admin | donor | volunteer

const DashboardAside = () => {
  return (
    <aside className="w-64 bg-red-950 text-white p-5">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>

      {/* ADMIN MENU */}
      {userRole === "admin" && (
        <>
          <NavLink to="/dashboard/admin" className="block mb-3">
            Admin Home
          </NavLink>
          <NavLink to="/dashboard/users" className="block mb-3">
            Manage Users
          </NavLink>
          <NavLink to="/dashboard/blood-requests" className="block mb-3">
            Blood Requests
          </NavLink>
        </>
      )}

      {/* DONOR MENU */}
      {userRole === "donor" && (
        <>
          <NavLink to="/dashboard/donor" className="block mb-3">
            Donor Home
          </NavLink>
          <NavLink to="/dashboard/my-donations" className="block mb-3">
            My Donations
          </NavLink>
        </>
      )}

      {/* VOLUNTEER MENU */}
      {userRole === "volunteer" && (
        <>
          <NavLink to="/dashboard/volunteer" className="block mb-3">
            Volunteer Home
          </NavLink>
          <NavLink to="/dashboard/assigned-requests" className="block mb-3">
            Assigned Requests
          </NavLink>
        </>
      )}
    </aside>
  );
};

export default DashboardAside;
