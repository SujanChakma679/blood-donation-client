import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router';
import Swal from 'sweetalert2';

const Login = () => {
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { signInWithGoogle, signInUser } = useContext(AuthContext);

  // Get the user wanted to visit, default to home
  const from = location.state?.from?.pathname || '/';

  // Email/Password login
  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    signInUser(email, password)
      .then(() => {
        Swal.fire({
          title: 'Logged In!',
          text: 'You have successfully logged in.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
        navigate(from, { replace: true });
      })
      .catch((err) => {
        setError(err.code);
      });
  };

  // Google login
  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then((result) => {
        const newUser = {
          name: result.user.displayName,
          email: result.user.email,
          image: result.user.photoURL,
        };

        // Save user to database
        fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log('User saved:', data);
          });

      

        navigate(from, { replace: true });
      })
      .catch((err) => {
        setError(err.code);
      });
  };

  return (
    <div className="card bg-base-100 w-full mx-auto max-w-sm shrink-0 shadow-2xl py-10">
      <div className="card-body">
        <h1 className="text-5xl font-bold">Login now!</h1>

        <form onSubmit={handleLogin}>
          <fieldset className="fieldset">
            <label className="label">Email</label>
            <input
              name="email"
              type="email"
              className="input"
              placeholder="Email"
              required
            />

            <label className="label">Password</label>
            <input
              name="password"
              type="password"
              className="input"
              placeholder="Password"
              required
            />

            <div>
              <a className="link link-hover">Forgot password?</a>
            </div>

            {error && <p className="text-red-600 text-xs mt-2">{error}</p>}

            <p className="mt-2">
              Are you new to our website? Please{' '}
              <Link
                to="/register"
                className="text-green-700 hover:text-green-400 underline"
              >
                Register
              </Link>
            </p>

            <button className="btn btn-neutral mt-4 w-full">Login</button>
          </fieldset>
        </form>

        {/* Google login */}
        <button
          onClick={handleGoogleSignIn}
          className="btn bg-white text-black border-[#e5e5e5] mt-4 w-full flex items-center justify-center gap-2"
        >
          <svg
            aria-label="Google logo"
            width="16"
            height="16"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <g>
              <path d="m0 0H512V512H0" fill="#fff"></path>
              <path
                fill="#34a853"
                d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
              ></path>
              <path
                fill="#4285f4"
                d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
              ></path>
              <path
                fill="#fbbc02"
                d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
              ></path>
              <path
                fill="#ea4335"
                d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
              ></path>
            </g>
          </svg>
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
