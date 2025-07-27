import { useEffect, useState } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import "./adminPanel.css";

// Axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
  withCredentials: true,
});

const AdminPanel = () => {
  const [admins, setAdmins] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("moderator");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      setError("Unauthorized: Please log in.");
      return;
    }
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/all-users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdmins(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const addAdmin = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Unauthorized: Please log in first");
      return;
    }

    if (password.length < 6) {
      setSnack({ open: true, message: "Password must be at least 6 characters.", severity: "error" });
      return;
    }

    try {
      const res = await API.post(
        "/admin/register",
        { name, email, password, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSnack({ open: true, message: "Admin added successfully!", severity: "success" });
      setName("");
      setEmail("");
      setPassword("");
      setRole("moderator");
      fetchAdmins();
    } catch (err) {
      setSnack({ open: true, message: err.response?.data?.error || "Failed to add admin", severity: "error" });
    }
  };

  const deleteAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    try {
      await API.delete(`/admin/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnack({ open: true, message: "Admin deleted successfully", severity: "success" });
      fetchAdmins();
    } catch (err) {
      setSnack({ open: true, message: "Failed to delete admin", severity: "error" });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>Admin Management</Typography>

      {error && <Typography color="error">{error}</Typography>}

      <form onSubmit={addAdmin} style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <FormControl style={{ minWidth: 150 }}>
          <InputLabel>Role</InputLabel>
          <Select value={role} onChange={(e) => setRole(e.target.value)} required>
            <MenuItem value="superadmin">Super Admin (Principal)</MenuItem>
            <MenuItem value="admin">Admin (HoD)</MenuItem>
            <MenuItem value="moderator">Moderator (Teacher)</MenuItem>
          </Select>
        </FormControl>

        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? "Adding..." : "Add User"}
        </Button>
      </form>

      <Typography variant="h5" gutterBottom>All Users</Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {admins.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</TableCell>
                  <TableCell>
                    {user.role !== "superadmin" && (
                      <Button variant="contained" color="secondary" onClick={() => deleteAdmin(user.id)}>
                        Delete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Snackbar for Notifications */}
      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} variant="filled">
          {snack.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminPanel;
