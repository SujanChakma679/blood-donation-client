import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { NavLink } from "react-router";
import Swal from "sweetalert2";

const DonorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    axios
      .get("http://localhost:5000/donation-requests", {
        params: { email: user.email },
      })
      .then((res) => {
        const latestThree = res.data.slice(0, 3);
        setRecentRequests(latestThree);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard fetch error:", err);
        setLoading(false);
      });
  }, [user]);

  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete this request?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(
          `http://localhost:5000/donation-requests/${id}`
        );
        setRecentRequests((prev) =>
          prev.filter((r) => r._id !== id)
        );
        Swal.fire("Deleted!", "Request removed", "success");
      }
    });
  };

  /* ================= STATUS UPDATE ================= */
  const updateStatus = async (id, status) => {
    await axios.patch(
      `http://localhost:5000/donation-requests/status/${id}`,
      { status }
    );

    setRecentRequests((prev) =>
      prev.map((r) =>
        r._id === id ? { ...r, donationStatus: status } : r
      )
    );
  };

  return (
    <div className="p-6">
      {/* Welcome */}
      <h1 className="text-2xl font-bold mb-6">
        Welcome, {user?.displayName || "Donor"} 👋
      </h1>

      {/* Recent Requests */}
      {!loading && recentRequests.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4">
            Recent Donation Requests
          </h2>

          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Recipient</th>
                  <th>Location</th>
                  <th>Date / Time</th>
                  <th>Blood</th>
                  <th>Status</th>
                  <th>Donor Info</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {recentRequests.map((req, index) => (
                  <tr key={req._id}>
                    <td>{index + 1}</td>
                    <td>{req.recipientName}</td>
                    <td>
                      {req.district}, {req.upazila}
                    </td>
                    <td>
                      {req.donationDate} <br />
                      {req.donationTime}
                    </td>
                    <td>{req.bloodGroup}</td>

                    {/* Status */}
                    <td>
                      <span
                        className={`badge ${
                          req.donationStatus === "pending"
                            ? "badge-warning"
                            : req.donationStatus === "inprogress"
                            ? "badge-info"
                            : req.donationStatus === "done"
                            ? "badge-success"
                            : "badge-error"
                        }`}
                      >
                        {req.donationStatus}
                      </span>
                    </td>

                    {/* Donor Info */}
                    <td>
                      {req.donationStatus === "inprogress" ? (
                        <div>
                          <p>{req.donorName}</p>
                          <p className="text-xs">
                            {req.donorEmail}
                          </p>
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>

                    {/* Actions */}
                    <td className="flex gap-2 flex-wrap">
                      {/* View always */}
                      <NavLink
                        to={`/dashboard/request/${req._id}`}
                        className="btn btn-xs btn-info"
                      >
                        View
                      </NavLink>

                      {/* Pending → Edit & Delete */}
                      {req.donationStatus === "pending" && (
                        <>
                          <NavLink
                            to={`/dashboard/edit-request/${req._id}`}
                            className="btn btn-xs btn-warning"
                          >
                            Edit
                          </NavLink>

                          <button
                            onClick={() =>
                              handleDelete(req._id)
                            }
                            className="btn btn-xs btn-error"
                          >
                            Delete
                          </button>
                        </>
                      )}

                      {/* Inprogress → Done & Cancel */}
                      {req.donationStatus === "inprogress" && (
                        <>
                          <button
                            onClick={() =>
                              updateStatus(req._id, "done")
                            }
                            className="btn btn-xs btn-success"
                          >
                            Done
                          </button>

                          <button
                            onClick={() =>
                              updateStatus(req._id, "canceled")
                            }
                            className="btn btn-xs btn-outline"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* View All */}
          <div className="mt-6">
            <NavLink
              to="/dashboard/my-donation-requests"
              className="btn-gradient"
            >
              View My All Requests
            </NavLink>
          </div>
        </>
      )}

      {/* No Requests */}
      {!loading && recentRequests.length === 0 && (
        <p className="text-gray-500">
          You haven’t created any donation request yet.
        </p>
      )}
    </div>
  );
};

export default DonorDashboard;
