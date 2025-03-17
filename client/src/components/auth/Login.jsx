import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!email || !password) {
      return setError("Please fill in all fields");
    }

    setError("");
    setLoading(true);

    try {
      const response = await login(email, password);
      console.log(response);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await loginWithGoogle();
      console.log(response);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to login with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-primary-soft flex flex-1 flex-col justify-center relative overflow-hidden min-h-screen">
      {/* Background decorative element */}
      <div className="absolute top-10 right-20 opacity-60">
        <svg
          width="704"
          height="854"
          viewBox="0 0 704 854"
          fill="none"
          className="text-primary-accent"
          xmlns="http://www.w3.org/2000/svg">
          <circle cx="352" cy="352" r="352" fill="url(#paint0_linear_51_188)">
          </circle>
          <circle
            cx="496.982"
            cy="646.982"
            r="169"
            transform="rotate(-75 496.982 646.982)"
            fill="url(#paint1_linear_51_188)">
          </circle>
          <defs>
            <linearGradient
              id="paint0_linear_51_188"
              x1="623.047"
              y1="106.25"
              x2="352.723"
              y2="542.094"
              gradientUnits="userSpaceOnUse">
              <stop offset="0.113181" stopColor="currentColor"></stop>
              <stop offset="1" stopColor="currentColor" stopOpacity="0"></stop>
            </linearGradient>
            <linearGradient
              id="paint1_linear_51_188"
              x1="627.115"
              y1="528.994"
              x2="497.329"
              y2="738.249"
              gradientUnits="userSpaceOnUse">
              <stop offset="0.113181" stopColor="currentColor"></stop>
              <stop offset="1" stopColor="currentColor" stopOpacity="0"></stop>
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container mx-auto px-4 z-10 relative">
        <div className="max-w-lg flex justify-center mx-auto">
          <Link to="/" className="text-lg">
            <span className="font-bold text-primary-strong text-3xl">Riverlytics</span>
          </Link>
        </div>

        <div className="bg-white max-w-lg shadow-xl p-10 rounded-md flex flex-col my-8 mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Login</h1>
            <p className="text-default text-sm mt-2">
              Please login to access your account.
            </p>
          </div>

          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex gap-4 justify-center border border-primary-accent rounded-lg w-full py-3.5 px-2 shadow-lg shadow-primary-accent/50 hover:-translate-y-0.5 transition-all text-default hover:shadow-primary-accent/70 font-semibold">
              <svg className="w-6 h-6" viewBox="0 0 40 40">
                <path
                  d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                  fill="#FFC107">
                </path>
                <path
                  d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z"
                  fill="#FF3D00">
                </path>
                <path
                  d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z"
                  fill="#4CAF50">
                </path>
                <path
                  d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                  fill="#1976D2">
                </path>
              </svg>
              <span>{loading && handleGoogleLogin ? "Logging in..." : "Login with Google"}</span>
            </button>
          </div>

          <div className="flex gap-2 items-center mt-6">
            <div className="flex-1 border-b border-default-soft/20"></div>
            <p className="font-medium text-sm text-default-soft">OR</p>
            <div className="flex-1 border-b border-default-soft/20"></div>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label htmlFor="email" className="text-sm sr-only">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-default-soft/30 placeholder:text-sm placeholder:text-default rounded-md px-3 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="password" className="text-sm sr-only">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-default-soft/30 placeholder:text-sm placeholder:text-default rounded-md px-3 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
              
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot your password?
                </Link>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white rounded-md font-semibold px-2 py-3.5 hover:bg-primary-strong disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Logging in..." : "Login to your account"}
              </button>
              
              <p className="text-default-soft text-sm text-center mt-2">
                Don't have an account? <Link
                  to="/signup"
                  className="underline text-primary">
                  Signup
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;