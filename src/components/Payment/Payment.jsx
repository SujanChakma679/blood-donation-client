import { useEffect, useState, useContext } from "react";
import useAxios from "../../Hooks/Axios/UseAxios/useAxios";
import { AuthContext } from "../../context/AuthContext";


const Payment = () => {
  const axiosInstance = useAxios();
  const { user, loading: authLoading } = useContext(AuthContext);

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.email) return;

    const fetchDonations = async () => {
      try {
        const res = await axiosInstance.get("/donations", {
          params: {
            email: user.email,
            role: user.role || "", 
          },
        });

        setDonations(res.data);
      } catch (err) {
        console.error("Failed to fetch donations", err);

        if (err.response?.status === 403) {
          setError("You have not made any financial donation yet.");
        } else {
          setError("Failed to load donation data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [user?.email]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">💰 Financial Donations</h2>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {donations.map((donation, index) => (
              <tr key={donation._id}>
                <td>{index + 1}</td>
                <td>{donation.name}</td>
                <td>{donation.email}</td>
                <td className="font-semibold text-green-600">
                  ${donation.amount}
                </td>
                <td>
                  {new Date(donation.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {donations.length === 0 && (
          <p className="text-center text-gray-500 py-6">
            No donations found
          </p>
        )}
      </div>
    </div>
  );
};

export default Payment;
