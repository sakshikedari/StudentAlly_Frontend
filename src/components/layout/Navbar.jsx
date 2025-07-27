import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import logo from "/src/components/studentally.png";
import userIcon from "/src/assets/usericon.png";
import axios from "axios";
import "./Navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const location = useLocation();
  const [shrink, setShrink] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShrink(true);
      } else {
        setShrink(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    const fetchUserRole = async () => {
      try {
        const res = await axios.get("http://localhost:5000/user-role", { withCredentials: true });
        console.log("Fetched User Role:", res.data.role);
        setUserRole(res.data.role);
      } catch (error) {
        console.error("Error fetching user role", error);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleUserUpdate = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      setUser(updatedUser);
    };

    window.addEventListener("userUpdated", handleUserUpdate);
    return () => {
      window.removeEventListener("userUpdated", handleUserUpdate);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    setUserRole(null);
    navigate("/alumni-login");
  };

  const toggleProfile = () => {
    setIsProfileOpen((prev) => !prev);
  };

  const navLinks = [
    { to: "/directory", label: "Directory" },
    { to: "/jobs", label: "Jobs" },
    { to: "/success-stories", label: "Success Stories" },
    { to: "/events", label: "Events" },
    { to: "/donate", label: "Donate" },
  ];

  const isAdminPanel = location.pathname.startsWith("/admin");

  return (
    <nav className={`navbar ${shrink ? "shrink" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-flex">
          <div className="navbar-logo">
            <Link to="/">
              <img src={logo} alt="Student Ally Logo" />
            </Link>
          </div>

          <div className="navbar-links hidden md:flex">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} className="text-gray-700 hover:text-primary-600">
                {label}
              </Link>
            ))}

            {(userRole === "admin" || isAdminPanel) && (
              <Link to="/admin" className="text-gray-700 hover:text-primary-600">Admin Panel</Link>
            )}
            {userRole === "hod" && (
              <Link to="/hod/dashboard" className="text-gray-700 hover:text-primary-600">HOD Dashboard</Link>
            )}
            {userRole === "teacher" && (
              <Link to="/teacher/students" className="text-gray-700 hover:text-primary-600">Students</Link>
            )}

            {user ? (
              <div className="user-menu" ref={profileRef}>
                <img src={userIcon} alt="Profile" className="user-icon" onClick={toggleProfile} />
                {isProfileOpen && (
                  <div className="dropdown active">
                    <p>{user.name}</p>
                    <p>{user.email}</p>
                    <p>{user.graduationYear}</p>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login-selection" className="navbar-button">Login</Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="navbar-menu-btn">
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Only visible on small screens */}
      {isOpen && (
        <div className="mobile-menu block md:hidden">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} className="block px-3 py-2" onClick={() => setIsOpen(false)}>
              {label}
            </Link>
          ))}

          {(userRole === "admin" || isAdminPanel) && (
            <Link to="/admin" className="block px-3 py-2" onClick={() => setIsOpen(false)}>
              Admin Panel
            </Link>
          )}
          {userRole === "hod" && (
            <Link to="/hod/dashboard" className="block px-3 py-2" onClick={() => setIsOpen(false)}>
              HOD Dashboard
            </Link>
          )}
          {userRole === "teacher" && (
            <Link to="/teacher/students" className="block px-3 py-2" onClick={() => setIsOpen(false)}>
              Students
            </Link>
          )}

          {user ? (
            <div className="mobile-user-menu">
              <img src={userIcon} alt="Profile" className="mobile-user-icon" />
              <p>{user.name}</p>
              <p>{user.email}</p>
              <p>{user.graduationYear}</p>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          ) : (
            <Link to="/alumni-login" className="navbar-button" onClick={() => setIsOpen(false)}>
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
