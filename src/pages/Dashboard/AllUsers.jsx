import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users");
      setUsers(res.data);
    } catch (err) {
      console.error("User fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Toggle block / unblock
  const handleToggleStatus = async (id, currentStatus) => {
    const action = currentStatus === "active" ? "Block" : "Unblock";

    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `You want to ${action.toLowerCase()} this user`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axios.patch(
        `http://localhost:5000/users/status/${id}`
      );

      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, status: res.data.status } : u
        )
      );

      Swal.fire("Success!", `User ${action}ed`, "success");
    } catch (err) {
      console.error("Status update failed:", err);
      Swal.fire("Error!", "Failed to update status", "error");
    }
  };

  // Change role
  const handleChangeRole = async (id, role) => {
    const result = await Swal.fire({
      title: "Change Role?",
      text: `Make this user ${role}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, change",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.patch(`http://localhost:5000/users/role/${id}`, { role });

      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role } : u))
      );

      Swal.fire("Updated!", "User role updated", "success");
    } catch (err) {
      console.error("Role update failed:", err);
      Swal.fire("Error!", "Failed to update role", "error");
    }
  };

  if (loading) return <p className="p-6">Loading users...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Users</h1>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>

                <td>
                  <img
                    src={user.photoURL}
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                  />
                </td>

                <td>{user.name}</td>
                <td>{user.email}</td>
                <td className="capitalize">{user.role}</td>

                <td>
                  <span
                    className={`badge ${
                      user.status === "active"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>

                <td className="flex flex-wrap gap-2">
                  {/* Block / Unblock */}
                  <button
                    onClick={() =>
                      handleToggleStatus(user._id, user.status)
                    }
                    className={`btn btn-xs ${
                      user.status === "active"
                        ? "btn-error"
                        : "btn-success"
                    }`}
                  >
                    {user.status === "active" ? "Block" : "Unblock"}
                  </button>

                  {/* Make Volunteer */}
                  {user.role !== "volunteer" && (
                    <button
                      onClick={() =>
                        handleChangeRole(user._id, "volunteer")
                      }
                      className="btn btn-xs btn-info"
                    >
                      Make Volunteer
                    </button>
                  )}

                  {/* Make Admin */}
                  {user.role !== "admin" && (
                    <button
                      onClick={() =>
                        handleChangeRole(user._id, "admin")
                      }
                      className="btn btn-xs btn-warning"
                    >
                      Make Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
