import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router";
import Swal from "sweetalert2";

const AllBloodDonationRequests = () => {
  const [requests, setRequests] = useState([]);

  // ✅ PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    axios
      .get("http://localhost:5000/donation-requests/all")
      .then((res) => setRequests(res.data))
      .catch((err) => console.error(err));
  }, []);

  // ✅ PAGINATION CALCULATION
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRequests = requests.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete request?",
      icon: "warning",
      showCancelButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        await axios.delete(
          `http://localhost:5000/donation-requests/${id}`
        );
        setRequests((prev) => prev.filter((r) => r._id !== id));
      }
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        All Blood Donation Requests
      </h1>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Recipient</th>
              <th>Location</th>
              <th>Date</th>
              <th>Time</th>
              <th>Blood</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentRequests.map((req, index) => (
              <tr key={req._id}>
                <td>{startIndex + index + 1}</td>
                <td>{req.recipientName}</td>
                <td>{req.district}, {req.upazila}</td>
                <td>{req.donationDate}</td>
                <td>{req.donationTime}</td>
                <td>{req.bloodGroup || "N/A"}</td>
                <td className="capitalize">{req.donationStatus}</td>

                <td className="flex gap-2 flex-wrap">
                  <NavLink
                    to={`/dashboard/request/${req._id}`}
                    className="btn btn-xs btn-info"
                  >
                    View
                  </NavLink>

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

      {/* ✅ PAGINATION UI */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          className="btn btn-sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </button>

        {[...Array(totalPages).keys()].map((page) => (
          <button
            key={page}
            className={`btn btn-sm ${
              currentPage === page + 1 ? "btn-primary" : ""
            }`}
            onClick={() => setCurrentPage(page + 1)}
          >
            {page + 1}
          </button>
        ))}

        <button
          className="btn btn-sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllBloodDonationRequests;
