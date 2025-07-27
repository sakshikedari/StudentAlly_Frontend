import { Routes, Route, Navigate } from "react-router-dom";
import AdminPanel from "../pages/admin/AdminPanel";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminRegister from "../pages/admin/AdminRegister";
import HODDashboard from "../pages/admin/HODDashboard";
import TeacherDashboard from "../pages/admin/TeacherDashboard";

const AdminRoutes = ({ adminToken, userRole }) => {
  return (
    <Routes>
      <Route path="/admin-register" element={<AdminRegister />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={adminToken ? <AdminPanel /> : <Navigate to="/admin-login" />}
      />
      <Route
        path="/hod/dashboard"
        element={userRole === "hod" ? <HODDashboard /> : <Navigate to="/" />}
      />
      <Route
        path="/teacher/students"
        element={userRole === "teacher" ? <TeacherDashboard /> : <Navigate to="/" />}
      />
    </Routes>
  );
};

export default AdminRoutes;
