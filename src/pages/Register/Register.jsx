import React, { useContext, useEffect, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { updateProfile } from "firebase/auth";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const Register = () => {
  const [error, setError] = useState("");
  const { createUser, setUser } = useContext(AuthContext);

  const [upazilas, setUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [upazila, setUpazila] = useState("");

  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState("");

  useEffect(() => {
    axios
      .get("/upazila.json")
      .then((res) => {
        setUpazilas(res.data.upazilas);
      })
      .catch((err) => console.error("Upazila fetch error:", err));

    axios
      .get("/district.json")
      .then((res) => {
        setDistricts(res.data.districts || res.data);
      })
      .catch((err) => console.error("District fetch error:", err));
  }, []);

  // 🔹 FILTER UPAZILAS BASED ON DISTRICT
  useEffect(() => {
    if (!district) {
      setFilteredUpazilas([]);
      setUpazila("");
      return;
    }

    const selectedDistrict = districts.find(
      (d) => d.name === district
    );

    if (selectedDistrict) {
      const matchedUpazilas = upazilas.filter(
        (u) => u.district_id === selectedDistrict.id
      );
      setFilteredUpazilas(matchedUpazilas);
    }
  }, [district, districts, upazilas]);

  const location = useLocation();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;

    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const photo = form.photo;
    const file = photo.files[0];
    const blood = form.blood.value;

    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=<>?{}[\]~]).{6,}$/;

    if (!passwordPattern.test(password)) {
      setError(
        "Password must be at least 6 characters, include 1 uppercase, 1 lowercase, and 1 special character."
      );
      Swal.fire({
        icon: "error",
        title: "Weak Password",
        text: "Password must be at least 6 characters, include 1 uppercase, 1 lowercase, and 1 special character.",
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Not Match",
        text: "Password must be match.",
      });
      return;
    }

    const res = await axios.post(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMBB}`,
      { image: file },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const photoURL = res.data.data.display_url;

    const formData = {
      name,
      email,
      password,
      photoURL,
      blood,
      district,
      upazila,
    };

    if (res.data.success === true) {
      setError("");

      createUser(email, password)
        .then((result) => {
          setUser(result.user);

          updateProfile(result.user, {
            displayName: name,
            photoURL,
          }).then(() => {
            axios.post("http://localhost:5000/users", formData);

            Swal.fire({
              icon: "success",
              title: "Account Created!",
              text: "Your account has been created successfully.",
            }).then(() => {
              form.reset();
              navigate(location?.state || "/");
            });
          });
        })
        .catch((error) => {
          setError(error.message);
          Swal.fire({
            icon: "error",
            title: "Registration Failed",
            text: error.message,
          });
        });
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <h1 className="text-2xl font-bold">Register now!</h1>

            <form onSubmit={handleRegister}>
              <fieldset className="fieldset">
                <label className="label">Name</label>
                <input name="name" type="text" className="input" required />

                <label className="label">Upload Your Photo</label>
                <input name="photo" type="file" className="input" />

                <label className="label">Email</label>
                <input name="email" type="email" className="input" required />

                <select name="blood" className="select select-neutral" required>
                  <option disabled selected>
                    Choose Your Blood Group
                  </option>
                  {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>

                {/* DISTRICT */}
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="select select-neutral"
                  required
                >
                  <option value="" disabled>
                    Select Your District
                  </option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>

                {/* UPAZILA */}
                <select
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                  className="select select-neutral"
                  disabled={!district}
                  required
                >
                  <option value="" disabled>
                    Select Your Upazila
                  </option>
                  {filteredUpazilas.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name}
                    </option>
                  ))}
                </select>

                <label className="label">Password</label>
                <input name="password" type="password" className="input" required />

                <label className="label">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  className="input"
                  required
                />

                <button type="submit" className="btn btn-neutral mt-4">
                  Register
                </button>
              </fieldset>

              {error && <p className="text-red-600 mt-2">{error}</p>}
            </form>

            <p className="mt-2">
              Already have an account?{" "}
              <Link to="/login" className="text-green-700 underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
