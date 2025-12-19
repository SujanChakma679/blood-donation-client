import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { NavLink } from "react-router";

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
        // take only latest 3 requests
        const latestThree = res.data.slice(0, 3);
        setRecentRequests(latestThree);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard fetch error:", err);
        setLoading(false);
      });
  }, [user]);

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <h1 className="text-2xl font-bold mb-6">
        Welcome, {user?.displayName || "Donor"} 👋
      </h1>

      {/* Recent Requests Section */}
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
                  <th>Date</th>
                  <th>Time</th>
                  <th>Blood Group</th>
                  <th>Status</th>
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
                    <td>{req.donationDate}</td>
                    <td>{req.donationTime}</td>
                    <td>{req.bloodGroup || "N/A"}</td>
                    <td>{req.donationStatus}</td>

                    <td className="flex gap-2 flex-wrap">
                      {/* View */}
                      <NavLink
                        to={`/dashboard/request/${req._id}`}
                        className="btn btn-xs btn-info"
                      >
                        View
                      </NavLink>

                      {/* Edit */}
                      <NavLink
                        to={`/dashboard/edit-request/${req._id}`}
                        className="btn btn-xs btn-warning"
                      >
                        Edit
                      </NavLink>

                      {/* Delete */}
                      <button className="btn btn-xs btn-error">
                        Delete
                      </button>

                      {/* Status buttons ONLY if inprogress */}
                      {req.donationStatus === "inprogress" && (
                        <>
                          <button className="btn btn-xs btn-success">
                            Done
                          </button>
                          <button className="btn btn-xs btn-outline">
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

          {/* View All Button */}
          <div className="mt-6">
            <NavLink
              to="/dashboard/my-donation-requests"
              className="btn btn-primary"
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
