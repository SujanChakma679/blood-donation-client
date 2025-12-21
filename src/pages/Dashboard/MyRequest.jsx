import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";


const MyDonationRequests = () => {
  const { user } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    if (!user?.email) return;

    axios
      .get("http://localhost:5000/donation-requests", {
        params: { email: user.email },
      })
      .then((res) => setRequests(res.data))
      .catch((err) => console.error(err));
  }, [user]);

  /* ================= FILTER ================= */
  const filteredRequests = filter
    ? requests.filter((r) => r.donationStatus === filter)
    : requests;

  /* ================= PAGINATION ================= */
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filteredRequests.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

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
        setRequests((prev) => prev.filter((r) => r._id !== id));
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

    setRequests((prev) =>
      prev.map((r) =>
        r._id === id ? { ...r, donationStatus: status } : r
      )
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Donation Requests</h1>

      {/* Filter */}
      <select
        className="select select-bordered mb-4"
        value={filter}
        onChange={(e) => {
          setFilter(e.target.value);
          setCurrentPage(1);
        }}
      >
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="inprogress">In Progress</option>
        <option value="done">Done</option>
        <option value="canceled">Canceled</option>
      </select>

      {/* Table */}
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
            {paginated.map((req, index) => (
              <tr key={req._id}>
                <td>{startIndex + index + 1}</td>
                <td>{req.recipientName}</td>
                <td>{req.district}, {req.upazila}</td>
                <td>
                  {req.donationDate} <br />
                  {req.donationTime}
                </td>
                <td>{req.bloodGroup}</td>

                <td>
                  <span className={`badge ${
                    req.donationStatus === "pending"
                      ? "badge-warning"
                      : req.donationStatus === "inprogress"
                      ? "badge-info"
                      : req.donationStatus === "done"
                      ? "badge-success"
                      : "badge-error"
                  }`}>
                    {req.donationStatus}
                  </span>
                </td>

                {/* Donor Info */}
                <td>
                  {req.donationStatus === "inprogress" ? (
                    <div>
                      <p>{req.donorName}</p>
                      <p className="text-xs">{req.donorEmail}</p>
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
                        onClick={() => handleDelete(req._id)}
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
                        onClick={() => updateStatus(req._id, "done")}
                        className="btn btn-xs btn-success"
                      >
                        Done
                      </button>

                      <button
                        onClick={() => updateStatus(req._id, "canceled")}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex gap-2">
          {[...Array(totalPages).keys()].map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num + 1)}
              className={`btn btn-xs ${
                currentPage === num + 1 ? "btn-primary" : ""
              }`}
            >
              {num + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDonationRequests;
