import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Register from "./pages/Register";
import LoginSelection from "./pages/LoginSelection";
import StudentLogin from "./pages/StudentLogin";
import AlumniLogin from "./pages/AlumniLogin";
import AlumniDirectory from "./pages/AlumniDirectory";
import JobPortal from "./pages/JobPortal";
import SuccessStories from "./pages/SuccessStories";
import Events from "./pages/Events";
import Donate from "./pages/Donate";
import AdminRoutes from "./routes/AdminRoutes"; 
import axios from "axios";
import './index.css';

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, 
  withCredentials: true, 
});

function App() {
  const [adminToken, setAdminToken] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    setAdminToken(storedToken);

    const fetchUserRole = async () => {
      try {
        const res = await axios.get(API, { withCredentials: true });
        setUserRole(res.data.role);
      } catch (error) {
        console.error("Error fetching user role", error);
      }
    };

    fetchUserRole();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userRole={userRole} isAdmin={!!adminToken} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login-selection" element={<LoginSelection />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/alumni-login" element={<AlumniLogin />} />
          <Route path="/directory" element={<AlumniDirectory />} />
          <Route path="/jobs" element={<JobPortal />} />
          <Route path="/success-stories" element={<SuccessStories />} />
          <Route path="/events" element={<Events />} />
          <Route path="/donate" element={<Donate />} />
        </Routes>

        <AdminRoutes adminToken={adminToken} userRole={userRole} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
