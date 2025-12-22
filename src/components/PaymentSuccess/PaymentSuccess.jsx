import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import useAxios from "../../Hooks/Axios/UseAxios/useAxios";


const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const axiosInstance = useAxios();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        if (!sessionId) {
          setError("Invalid payment session");
          setLoading(false);
          return;
        }

        // Verify payment + save to DB
        await axiosInstance.post("/confirm-payment", { sessionId });

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to verify payment");
        setLoading(false);
      }
    };

    confirmPayment();
  }, [sessionId, axiosInstance]);

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium text-gray-600">
          Verifying your payment...
        </p>
      </div>
    );
  }

  /* ---------- Error ---------- */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  /* ---------- Success ---------- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-20 h-20 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Successful 🎉
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your generous donation.  
          Your payment has been received successfully.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-sm text-gray-700">
          Your support makes a real difference 💚  
          We truly appreciate your kindness.
        </div>

        <div className="flex flex-col gap-3">
          <Link
            to="/"
            className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition"
          >
            Go to Home
          </Link>

          <Link
            to="/donation"
            className="border border-green-600 text-green-600 hover:bg-green-50 py-2 rounded-lg font-medium transition"
          >
            Donate Again
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          If you have any questions, please contact our support team.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
