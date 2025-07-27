import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("moderator"); 
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/admin/auth/register", {
        name,
        email,
        password,
        role,
      });

      alert(res.data.message);
      navigate("/admin-login");
    } catch (error) {
      alert(error.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div>
      <h2>Admin Registration</h2>
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

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default AdminRegister;
