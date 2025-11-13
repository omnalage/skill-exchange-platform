import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:5050/api/auth/login", {
        email,
        password,
      });
      setSuccess("Login successful!");
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("id", response.data.id);
      props.setIsLoggedIn(true);
      navigate("/");
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error || "Login failed");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen login-bg relative">
      {/* Inline CSS for themed colors */}
      <style>{`
        :root {
          --mint-600: #2dd4bf;
          --mint-500: #34d399;
          --navy-900: #071025;
          --navy-950: #020617;
          --cream-50: #fffaf0;
          --cream-200: rgba(255,250,240,0.85);
        }

        .login-bg {
          background: linear-gradient(180deg, var(--navy-900), var(--navy-950));
          color: var(--cream-50);
        }

        .login-card {
          background: rgba(255, 250, 240, 0.04);
          border: 1px solid rgba(255, 250, 240, 0.1);
          backdrop-filter: blur(10px);
        }

        .login-close {
          background: rgba(255,250,240,0.05);
          border: 1px solid rgba(255,250,240,0.08);
        }

        .login-input {
          background: rgba(255, 250, 240, 0.05);
          border: 1px solid rgba(255, 250, 240, 0.1);
          color: var(--cream-50);
        }
        .login-input:focus {
          outline: 2px solid var(--mint-600);
        }

        .btn-primary {
          background: var(--mint-600);
          color: #051826;
        }
        .btn-primary:hover {
          background: var(--mint-500);
        }

        .btn-secondary {
          background: transparent;
          border: 1px solid rgba(255,250,240,0.1);
          color: var(--cream-50);
        }
        .btn-secondary:hover {
          border-color: var(--mint-600);
          color: var(--mint-500);
        }
      `}</style>

      {/* Close Button */}
      <button
        className="absolute top-6 right-6 text-cream-50 text-xl px-3 py-1 rounded login-close hover:text-mint-500"
        onClick={() => navigate("/")}
      >
        ✕
      </button>

      {/* Login Card */}
      <form
        onSubmit={handleSubmit}
        className="login-card shadow-xl rounded-xl px-8 py-6 w-full max-w-sm"
      >
        <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: "var(--mint-500)" }}>
          Welcome Back
        </h2>

        {error && <p className="text-red-400 text-xs mb-4">{error}</p>}
        {success && <p className="text-green-400 text-xs mb-4">{success}</p>}

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1" style={{ color: "var(--cream-200)" }}>
            Email
          </label>
          <input
            type="email"
            className="w-full px-3 py-2 rounded login-input focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1" style={{ color: "var(--cream-200)" }}>
            Password
          </label>
          <input
            type="password"
            className="w-full px-3 py-2 rounded login-input focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`btn-primary font-bold py-2 px-4 rounded transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="btn-secondary font-bold py-2 px-4 rounded transition"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
