import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { updateProfile } from "firebase/auth";
import axios from "axios";

const Register = () => {
  const [error, setError] = useState("");
  const { createUser, setUser } = useContext(AuthContext);

  const [upazilas, setUpazilas] = useState([]);
  const [upazila, setUpazila] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState([]);

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
    // const role = form.role.value;
    const blood = form.blood.value;

    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=<>?{}[\]~]).{6,}$/;

    if (!passwordPattern.test(password)) {
      setError(
        "Password must be at least 6 characters, include 1 uppercase, 1 lowercase, and 1 special character."
      );
      // SweetAlert for password error
      Swal.fire({
        icon: "error",
        title: "Weak Password",
        text: "Password must be at least 6 characters, include 1 uppercase, 1 lowercase, and 1 special character.",
      });
      return;
    }

    // Check if passwords match
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
      // role,
      blood,
      district,
      upazila,
    };


    if (res.data.success == true) {
      // reset status
      setError("");

      createUser(email, password)
        .then((result) => {
          const user = result.user;
          setUser(user);

          const profile = {
            displayName: name,
            photoURL: photoURL,
          };

          updateProfile(result.user, profile)
            .then(() => {
              axios
                .post("http://localhost:5000/users", formData)
                .then((res) => {
                  console.log(res.data);
                })
                .catch((err) => {
                  console.log(err);
                });

              // success alert
              Swal.fire({
                icon: "success",
                title: "Account Created!",
                text: "Your account has been created successfully.",
              }).then(() => {
                form.reset();
                navigate(location?.state || "/");
              });
            })
            .catch((err) => {
              console.error(err.message);
              setError(err.message);
              Swal.fire({
                icon: "error",
                title: "Profile Update Failed",
                text: err.message,
              });
            });
        })
        .catch((error) => {
          console.log(error.message);
          setError(error.message);
          // SweetAlert for Firebase error
          Swal.fire({
            icon: "error",
            title: "Registration Failed",
            text: error.message,
          });
        });
    }
  };

  return (
    <div>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left"></div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body w-75">
              <h1 className="text-2xl font-bold">Register now!</h1>
              <form onSubmit={handleRegister}>
                <fieldset className="fieldset">
                  {/* name */}
                  <label className="label">Name</label>
                  <input
                    name="name"
                    type="text"
                    className="input"
                    placeholder="Name"
                    required
                  />
                  {/* photoURL */}
                  <label className="label">Upload Your Photo</label>
                  <input
                    name="photo"
                    type="file"
                    className="input"
                    placeholder="PhotoURL"
                  />
                  {/* email */}
                  <label className="label">Email</label>
                  <input
                    name="email"
                    type="email"
                    className="input"
                    placeholder="Email"
                    required
                  />

                  {/* select a role */}
                  {/* <select
                    name="role"
                    defaultValue="Select Your Role"
                    className="select select-neutral"
                    required
                  >
                    <option disabled={true}>Select Your Role</option>
                    <option value="donor">Donor</option>
                    <option value="volunteer">Volunteer</option>
                  </select> */}

                  {/* select your blood group */}

                  <select
                    name="blood"
                    className="select select-neutral"
                    defaultValue="Chose Your Blood Group"
                    required
                  >
                    <option disabled={true}>Chose Your Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>

                  {/* select a district */}
                  <select
                    value={district}
                    onChange={(e)=> setDistrict(e.target.value)}
                    className="select select-neutral"
                    required
                  >
                    <option value="" disabled>Select Your District</option>
                    {
                      districts.map(d=> <option value={d?.name} key={d.id}>{d?.name}</option>)
                    }
                   
                  </select>

                  {/* select a upazila */}
                  <select
                    value={upazila}
                    onChange={(e)=> setUpazila(e.target.value)}
                    className="select select-neutral"
                    required
                  >
                    <option value="" disabled>Select Your Upazila</option>
                    {
                      upazilas.map(u=> <option value={u?.name} key={u.id}>{u?.name}</option>)
                    }
                   
                  </select>

                  {/* password */}
                  <label className="label">Password</label>
                  <input
                    name="password"
                    type="password"
                    className="input"
                    placeholder="Password"
                    required
                  />

                  {/* Confirm Password Field */}
                  <div className="form-control">
                    <label className="label">Confirm Password</label>
                    <input
                      name="confirmPassword"
                      type="password"
                      className="input"
                      placeholder="Confirm Password"
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-neutral mt-4">
                    Register
                  </button>
                </fieldset>
                {error && <p className="text-red-600 mt-2">{error}</p>}
              </form>
              <p>
                Already have an account? Please,{" "}
                <Link
                  to={"/login"}
                  className="text-green-700 hover:text-green-400 underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
