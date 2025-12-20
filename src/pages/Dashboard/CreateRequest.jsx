import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";

const CreateRequest = () => {
  const { user, userStatus } = useContext(AuthContext);

  // ---------- STATES ----------
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);

  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");

  const [formData, setFormData] = useState({
    recipientName: "",
    hospitalName: "",
    address: "",
    bloodGroup: "",
    donationDate: "",
    donationTime: "",
    message: "",
  });

  // ---------- LOAD DISTRICT & UPAZILA ----------
  useEffect(() => {
    axios
      .get("/district.json")
      .then((res) => setDistricts(res.data.districts || res.data))
      .catch((err) => console.error("District fetch error:", err));

    axios
      .get("/upazila.json")
      .then((res) => setUpazilas(res.data.upazilas || res.data))
      .catch((err) => console.error("Upazila fetch error:", err));
  }, []);

  // ---------- HANDLE INPUT CHANGE ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ---------- HANDLE SUBMIT ----------

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const donationRequest = {
  //     requesterName: user?.displayName,
  //     requesterEmail: user?.email,
  //     recipientName: formData.recipientName,
  //     district,
  //     upazila,
  //     hospitalName: formData.hospitalName,
  //     address: formData.address,
  //     bloodGroup: formData.bloodGroup,
  //     donationDate: formData.donationDate,
  //     donationTime: formData.donationTime,
  //     message: formData.message,
  //     donationStatus: "pending",
  //     createdAt: new Date(),
  //   };

  //   try {
  //     const res = await axios.post(
  //       "http://localhost:5000/donation-requests",
  //       donationRequest
  //     );

  //     if (userStatus === "blocked") {
  //       return (
  //         <div className="p-6 text-center">
  //           <h2 className="text-xl font-bold text-red-600">
  //             You are blocked 🚫
  //           </h2>
  //           <p className="mt-2 text-gray-600">
  //             You cannot create a donation request. Please contact support.
  //           </p>
  //         </div>
  //       );
  //     }

  //     if (res.data.insertedId) {
  //       // 1. Show success alert
  //       Swal.fire({
  //         icon: "success",
  //         title: "Request Created!",
  //         text: "Donation request created successfully!",
  //       });

  //       // 2. Clear all form fields
  //       setFormData({
  //         recipientName: "",
  //         hospitalName: "",
  //         address: "",
  //         bloodGroup: "",
  //         donationDate: "",
  //         donationTime: "",
  //         message: "",
  //       });
  //       setDistrict("");
  //       setUpazila("");

  //       // Optional: Reset the form HTML element to clear any browser-level caching
  //       e.target.reset();
  //     }
  //   } catch (error) {
  //     console.error("Donation request error:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Oops...",
  //       text: "Something went wrong while creating the request.",
  //     });
  //   }
  // };

    const handleSubmit = async (e) => {
  e.preventDefault();

  // 🚫 BLOCKED USER CHECK (FRONTEND)
  if (userStatus === "blocked") {
    Swal.fire({
      icon: "error",
      title: "Access Denied 🚫",
      text: "Your account is blocked. You cannot create a donation request.",
      confirmButtonColor: "#d33",
    });
    return;
  }

  const donationRequest = {
    requesterName: user?.displayName,
    requesterEmail: user?.email,
    recipientName: formData.recipientName,
    district,
    upazila,
    hospitalName: formData.hospitalName,
    address: formData.address,
    bloodGroup: formData.bloodGroup,
    donationDate: formData.donationDate,
    donationTime: formData.donationTime,
    message: formData.message,
    donationStatus: "pending",
    createdAt: new Date(),
  };

  try {
    const res = await axios.post(
      "http://localhost:5000/donation-requests",
      donationRequest
    );

    if (res.data.insertedId) {
      Swal.fire({
        icon: "success",
        title: "Request Created ✅",
        text: "Donation request created successfully!",
        timer: 2000,
        showConfirmButton: false,
      });

      // Reset form
      setFormData({
        recipientName: "",
        hospitalName: "",
        address: "",
        bloodGroup: "",
        donationDate: "",
        donationTime: "",
        message: "",
      });
      setDistrict("");
      setUpazila("");
      e.target.reset();
    }
  } catch (error) {
    console.error("Donation request error:", error);
    Swal.fire({
      icon: "error",
      title: "Something went wrong",
      text: "Please try again later.",
    });
  }
};


  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Create Donation Request</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {/* Requester Name */}
        <input
          type="text"
          value={user?.displayName || ""}
          readOnly
          className="input input-bordered"
        />

        {/* Requester Email */}
        <input
          type="email"
          value={user?.email || ""}
          readOnly
          className="input input-bordered"
        />

        {/* Recipient Name */}
        <input
          type="text"
          name="recipientName"
          placeholder="Recipient Name"
          className="input input-bordered"
          required
          onChange={handleChange}
        />

        {/* District */}
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="select select-bordered"
          required
        >
          <option value="" disabled>
            Select District
          </option>
          {districts.map((d) => (
            <option key={d.id} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>

        {/* Upazila */}
        <select
          value={upazila}
          onChange={(e) => setUpazila(e.target.value)}
          className="select select-bordered"
          required
        >
          <option value="" disabled>
            Select Upazila
          </option>
          {upazilas.map((u) => (
            <option key={u.id} value={u.name}>
              {u.name}
            </option>
          ))}
        </select>

        {/* Hospital Name */}
        <input
          type="text"
          name="hospitalName"
          placeholder="Hospital Name"
          className="input input-bordered"
          required
          onChange={handleChange}
        />

        {/* Address */}
        <input
          type="text"
          name="address"
          placeholder="Full Address"
          className="input input-bordered"
          required
          onChange={handleChange}
        />

        {/* Blood Group */}
        <select
          name="bloodGroup"
          className="select select-bordered"
          value={formData.bloodGroup}
          required
          onChange={handleChange}
        >
          <option value="" disabled>
            Select Blood Group
          </option>
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
            <option key={bg} value={bg}>
              {bg}
            </option>
          ))}
        </select>

        {/* Date */}
        <input
          type="date"
          name="donationDate"
          className="input input-bordered"
          required
          onChange={handleChange}
        />

        {/* Time */}
        <input
          type="time"
          name="donationTime"
          className="input input-bordered"
          required
          onChange={handleChange}
        />

        {/* Message */}
        <textarea
          name="message"
          placeholder="Why blood is needed?"
          className="textarea textarea-bordered"
          required
          onChange={handleChange}
        ></textarea>

        {/* Submit */}
        <button type="submit" className="btn-gradient">
          Request Blood
        </button>
      </form>
    </div>
  );
};

export default CreateRequest;
