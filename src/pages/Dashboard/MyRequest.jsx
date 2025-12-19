import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const MyRequest = () => {
  const { user, loading } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    axios
      .get(`http://localhost:5000/donation-requests?email=${user.email}`)
      .then((res) => {
        setRequests(res.data);
        setDataLoading(false);
      })
      .catch((err) => {
        console.error("My request fetch error:", err);
        setDataLoading(false);
      });
  }, [user]);

  if (loading || dataLoading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Donation Requests</h2>

      {requests.length === 0 ? (
        <p>No donation requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Recipient</th>
                <th>Location</th>
                <th>Date</th>
                <th>Time</th>
                <th>Blood Group</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, index) => (
                <tr key={req._id}>
                  <td>{index + 1}</td>
                  <td>{req.recipientName}</td>
                  <td>
                    {req.district}, {req.upazila}, {req.hospitalName}, {req.address}
                  </td>
                  <td>{req.donationDate}</td>
                  <td>{req.donationTime}</td>
                  <td>{req.bloodGroup}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyRequest;
