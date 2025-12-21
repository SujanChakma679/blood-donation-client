import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";

const DonationRequests = () => {
  const [requests, setRequests] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/donation-requests/pending")
      .then((res) => res.json())
      .then((data) => {
        setRequests(Array.isArray(data) ? data : []);
      })
      .catch(console.error);
  }, []);

  const handleView = (id) => {
    if (!user) {
      navigate("/login", {
        state: { from: `/donation-requests/${id}` },
      });
    } else {
      navigate(`/donation-requests/${id}`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Available Blood Donation Requests 🩸
      </h1>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Recipient</th>
              <th>Location</th>
              <th>Blood Group</th>
              <th>Date</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-gray-500">
                  No pending donation requests found.
                </td>
              </tr>
            ) : (
              requests.map((req, index) => (
                <tr key={req._id}>
                  <td>{index + 1}</td>
                  <td>{req.recipientName}</td>
                  <td>
                    {req.district}, {req.upazila}
                  </td>
                  <td>{req.bloodGroup || "N/A"}</td>
                  <td>{req.donationDate}</td>
                  <td>{req.donationTime}</td>
                  <td>
                    <button
                      onClick={() => handleView(req._id)}
                      className="btn btn-xs btn-primary"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationRequests;
