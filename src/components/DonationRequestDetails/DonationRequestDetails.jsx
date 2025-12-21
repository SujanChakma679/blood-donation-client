import React, { useContext, useEffect, useState } from "react";
import { useParams, NavLink } from "react-router";
import Swal from "sweetalert2";

import { AuthContext } from "../../context/AuthContext";
import AxiosSecure from "../../Hooks/Axios/AxiosSecure";


const DonationRequestDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);



  // Fetch request details
  useEffect(() => {
    AxiosSecure.get(`/donation-requests/${id}`)
      .then((res) => {
        setRequest(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  // Donate handler
  const handleConfirmDonate = async () => {
    try {
      const donateInfo = {
        donorName: user?.displayName,
        donorEmail: user?.email,
        donationStatus: "inprogress",
      };

      const res = await AxiosSecure.patch(
        `/donation-requests/${id}/donate`,
        donateInfo
      );

      if (res.data.modifiedCount > 0) {
        setRequest((prev) => ({
          ...prev,
          ...donateInfo,
        }));
        setOpenModal(false);
        Swal.fire("Success", "Donation confirmed!", "success");
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!request) return <p className="text-center mt-10">Request not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Blood Donation Request Details
      </h1>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <tbody>
            <tr>
              <th>Recipient Name</th>
              <td>{request.recipientName}</td>
            </tr>
            <tr>
              <th>Blood Group</th>
              <td>{request.bloodGroup}</td>
            </tr>
            <tr>
              <th>District</th>
              <td>{request.district}</td>
            </tr>
            <tr>
              <th>Upazila</th>
              <td>{request.upazila}</td>
            </tr>
            <tr>
              <th>Hospital</th>
              <td>{request.hospitalName}</td>
            </tr>
            <tr>
              <th>Donation Date</th>
              <td>{request.donationDate}</td>
            </tr>
            <tr>
              <th>Donation Time</th>
              <td>{request.donationTime}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>
                <span className="badge badge-info">
                  {request.donationStatus}
                </span>
              </td>
            </tr>

            {request.donationStatus === "inprogress" && (
              <>
                <tr>
                  <th>Donor Name</th>
                  <td>{request.donorName}</td>
                </tr>
                <tr>
                  <th>Donor Email</th>
                  <td>{request.donorEmail}</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* ACTIONS */}
      <div className="mt-6 flex gap-3">
        {request.donationStatus === "pending" && (
          <button
            className="btn-gradient"
            onClick={() => setOpenModal(true)}
          >
            Donate
          </button>
        )}

        <NavLink to="/donation-requests" className="btn btn-ghost">
          Back
        </NavLink>
      </div>

      {/* MODAL */}
      {openModal && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              Confirm Donation
            </h3>

            <div className="space-y-3">
              <div>
                <label className="label">Donor Name</label>
                <input
                  type="text"
                  readOnly
                  value={user?.displayName || ""}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="label">Donor Email</label>
                <input
                  type="email"
                  readOnly
                  value={user?.email || ""}
                  className="input input-bordered w-full"
                />
              </div>
            </div>

            <div className="modal-action">
              <button
                onClick={handleConfirmDonate}
                className="btn btn-success"
              >
                Confirm
              </button>
              <button
                onClick={() => setOpenModal(false)}
                className="btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default DonationRequestDetails;
