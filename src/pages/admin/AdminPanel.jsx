import { useEffect, useState } from "react";
import { Button, TextField, MenuItem, Select, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography } from "@mui/material";

const AdminPanel = () => {
  const [admins, setAdmins] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("moderator");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      
      const response = await fetch("http://localhost:5000/admin/all-users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) throw new Error("Failed to fetch users");
  
      const data = await response.json();
  
      setAdmins(data);  
    } catch (error) {
      setError(error.message);
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
  
    try {
      const res = await fetch("http://localhost:5000/admin/register", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, password, role }),
      });
  
      const data = await res.json();
      console.log("user data",data);
  
      if (!res.ok) {
        throw new Error(data.error || "Failed to add admin");
      }
  
      alert("Admin added successfully!");
      setName("");
      setEmail("");
      setPassword("");
      setRole("moderator");
  
      fetchAdmins();
    } catch (error) {
      console.error("Error Adding Admin:", error.message);
      alert("Error: " + error.message);
    }
  };
  

  const deleteAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    try {
      const res = await fetch(`http://localhost:5000/admin/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete admin");

      fetchAdmins();
    } catch (error) {
      console.error("Error deleting admin", error);
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>Admin Management</Typography>

      {error && <Typography color="error">{error}</Typography>}

      <form onSubmit={addAdmin} style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <FormControl>
          <InputLabel>Role</InputLabel>
          <Select value={role} onChange={(e) => setRole(e.target.value)}>
            <MenuItem value="superadmin">Super Admin (Principal)</MenuItem>
            <MenuItem value="admin">Admin (HoD)</MenuItem>
            <MenuItem value="moderator">Moderator (Teacher)</MenuItem>
          </Select>
        </FormControl>

        <Button type="submit" variant="contained" color="primary">Add User</Button>
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
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {admins.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
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
    </div>
  );
};

export default AdminPanel;
