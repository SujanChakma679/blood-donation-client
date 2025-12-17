


import React, { useContext, useState }  from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { updateProfile } from "firebase/auth";
import axios from "axios";

const Register = () => {
  const [error, setError] = useState("");
  const { createUser, setUser } = useContext(AuthContext);

  const location = useLocation();
  const navigate = useNavigate();

  const handleRegister = async(e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const photo = form.photo;
    const file = photo.files[0];

    console.log(file)

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

    const res = await axios.post(`https://api.imgbb.com/1/upload?key=ab6e3d0f432926f93d9ca9af62dc2411`,
        {image:file},
        {
            headers:{
                'Content-Type': 'multipart/form-data'
            }
        }
    )

    const photoURL = res.data.data.
display_url;

if(res.data.success == true) {
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
                  {/* password */}
                  <label className="label">Password</label>
                  <input
                    name="password"
                    type="password"
                    className="input"
                    placeholder="Password"
                    required
                  />
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

