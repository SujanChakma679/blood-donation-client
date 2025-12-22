import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const VolunteerDashboard = () => {

  const { user } = useContext(AuthContext);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
         Welcome, {user?.displayName || "Volunteer"}! 👋
      </h1>

      <p className="text-gray-600">
        You can view all donation requests and update donation status only.
      </p>
    </div>
  );
};

export default VolunteerDashboard;
