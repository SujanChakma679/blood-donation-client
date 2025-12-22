import React, { useContext, useState } from "react";
import Swal from "sweetalert2";
import useAxios from "../../Hooks/Axios/UseAxios/useAxios";
import { AuthContext } from "../../context/AuthContext";


const Donation = () => {
  const axiosInstance = useAxios();
  const { user } = useContext(AuthContext);

  const [amount, setAmount] = useState(30);
  const name = user?.displayName || "";
  const email = user?.email || "";

  const handleDonate = async (e) => {
    e.preventDefault();

    // ✅ HARD VALIDATION
    if (typeof amount !== "number" || amount <= 0) {
      return Swal.fire("Error", "Enter a valid donation amount", "error");
    }

    const donationData = {
      donationAmount: amount, 
      name,
      email,
    };

    try {
      const res = await axiosInstance.post("/create-payment", donationData);

      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        throw new Error("Stripe URL missing");
      }

    } catch (error) {
      console.error("Donation error:", error.response?.data || error.message);
      Swal.fire("Error", "Payment failed", "error");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-6">
      <div className="card bg-base-100 shadow-xl w-full max-w-lg">
        <div className="card-body">

          <h1 className="text-3xl font-bold text-center">
            Support Blood Donation 🩸
          </h1>

          <form onSubmit={handleDonate}>
            {/* Amount */}
            <div className="mt-6">
              <label className="label font-semibold">Select Amount</label>

              <div className="grid grid-cols-3 gap-3">
                {[30, 50, 100 ].map((amt) => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => setAmount(amt)}
                    className={`btn ${
                      amount === amt ? "btn-primary" : "btn-outline"
                    }`}
                  >
                    $ {amt}
                  </button>
                ))}
              </div>

              <input
                type="number"
                min={1}
                className="input input-bordered mt-3 w-full"
                value={amount}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (!Number.isNaN(val) && val > 0) {
                    setAmount(val);
                  }
                }}
              />
            </div>

            {/* User Info */}
            <div className="mt-4">
              <input
                className="input input-bordered w-full mb-2"
                value={name}
                readOnly
              />
              <input
                className="input input-bordered w-full"
                value={email}
                readOnly
              />
            </div>

            <button type="submit" className="btn btn-success mt-6 w-full">
              Donate Now
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Donation;
