import { useEffect, useState } from "react";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/admin/users", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(res => res.json())
        .then(data => setUsers(data))
        .catch(error => console.error("Error:", error));
    }, []);

    const updateRole = async (id, newRole) => {
        await fetch(`http://localhost:5000/admin/users/${id}/role`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ role: newRole }),
        });
        alert("Role updated successfully!");
        window.location.reload();
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <button onClick={() => updateRole(user.id, "hod")}>Make HOD</button>
                                <button onClick={() => updateRole(user.id, "teacher")}>Make Teacher</button>
                                <button onClick={() => updateRole(user.id, "student")}>Make Student</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
