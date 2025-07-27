import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
  withCredentials: true,
});

const AdminRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("moderator");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/admin/auth/register", {
        name,
        email,
        password,
        role,
      });

      alert(res.data.message || "Registration successful!");
      navigate("/admin-login");
    } catch (err) {
      const errMsg = err.response?.data?.error || "Registration failed";
      setError(errMsg);
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-register-container">
      <div className="admin-register-box">
        <h2>Admin Registration</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="superadmin">Super Admin (Principal)</option>
            <option value="admin">Admin (HoD)</option>
            <option value="moderator">Moderator (Teacher)</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
