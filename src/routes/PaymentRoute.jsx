import { Navigate, useLocation } from "react-router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import useAxios from "../Hooks/Axios/UseAxios/useAxios";


const PaymentRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const axiosInstance = useAxios();
  const location = useLocation();

  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user?.email) {
        setChecking(false);
        return;
      }

      try {
        const res = await axiosInstance.get("/donations-access", {
          params: { email: user.email, role: user.role },
        });

        setAllowed(res.data.allowed);
      } catch (err) {
        console.error("Access check failed", err);
        setAllowed(false);
      } finally {
        setChecking(false);
      }
    };

    checkAccess();
  }, [user]);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!allowed) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default PaymentRoute;
