import { useState, useEffect } from "react";
import axios from "axios";
import "./AlumniDirectory.css";

function AlumniDirectory() {
  const [alumni, setAlumni] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    graduation_year: "",
    job_title: "",
    company: "",
    profile_pic: "",
    bio: "",
    linkedin: "",
    github: "",
  });
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch logged-in user info from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setCurrentUser(user);
      setFormData((prev) => ({ ...prev, email: user.email }));
    }
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/alumni")
      .then((res) => setAlumni(res.data))
      .catch((err) => console.error("Error fetching alumni:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please log in to add a profile.");
      return;
    }

    if (!formData.name || !formData.email || !formData.graduation_year || !formData.job_title || !formData.profile_pic || !formData.bio) {
      alert("All fields marked * are required!");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/alumni/${editingId}`, formData);
      } else {
        await axios.post("http://localhost:5000/alumni", {
          ...formData,
          user_id: currentUser.id,
        });
      }

      const response = await axios.get("http://localhost:5000/alumni");
      setAlumni(response.data);
      setFormVisible(false);
      setEditingId(null);
      setFormData({
        name: "",
        email: currentUser.email,
        graduation_year: "",
        job_title: "",
        company: "",
        profile_pic: "",
        bio: "",
        linkedin: "",
        github: "",
      });
    } catch (error) {
      console.error("Error saving alumni:", error);
    }
  };

  const handleEdit = (alumnus) => {
    if (currentUser?.id !== alumnus.user_id) {
      alert("You are not authorized to edit this profile.");
      return;
    }
    setFormData(alumnus);
    setEditingId(alumnus.id);
    setFormVisible(true);
  };

  const handleDelete = async (id, user_id) => {
    if (currentUser?.id !== user_id) {
      alert("You are not authorized to delete this profile.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this profile?")) {
      try {
        await axios.delete(`http://localhost:5000/alumni/${id}`);
        setAlumni(alumni.filter((alumnus) => alumnus.id !== id));
      } catch (error) {
        console.error("Error deleting alumni:", error);
      }
    }
  };

  const filteredAlumni = alumni.filter((alumnus) =>
    alumnus.name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (filterYear === "" || alumnus.graduation_year?.toString() === filterYear)
  );

  return (
    <div className="directory-container">
      <section className="intro-section">
        <img src="/img/alumni.jpg" alt="Alumni Banner" className="banner-image" />
        <h2>Welcome to the Alumni Directory</h2>
        <p>
          Discover and connect with alumni who have contributed to various industries. Stay in touch with your network,
          find mentorship, and explore success stories from graduates of different years.
        </p>
      </section>

      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search by name..."
          className="search-bar"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select className="filter-dropdown" onChange={(e) => setFilterYear(e.target.value)}>
          <option value="">Filter by Graduation Year</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
        </select>
      </div>

      <button className="btn-primary" onClick={() => {
        if (!currentUser) {
          alert("Please log in to add a profile.");
          return;
        }
        setFormVisible(!formVisible);
      }}>
        {formVisible ? "Close Form" : "Add Alumni"}
      </button>

      {formVisible && currentUser && (
        <form className="alumni-form" onSubmit={handleSubmit}>
          <label>Name <span className="required">*</span></label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />

          <label>Email <span className="required">*</span></label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required readOnly />

          <label>Graduation Year <span className="required">*</span></label>
          <input type="number" name="graduation_year" value={formData.graduation_year} onChange={handleChange} required />

          <label>Job Title <span className="required">*</span></label>
          <input type="text" name="job_title" value={formData.job_title} onChange={handleChange} required />

          <label>Company</label>
          <input type="text" name="company" value={formData.company} onChange={handleChange} />

          <label>Profile Picture URL <span className="required">*</span></label>
          <input type="text" name="profile_pic" value={formData.profile_pic} onChange={handleChange} required />

          <label>Bio <span className="required">*</span></label>
          <textarea name="bio" value={formData.bio} onChange={handleChange} required></textarea>

          <label>LinkedIn</label>
          <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} />

          <label>GitHub</label>
          <input type="text" name="github" value={formData.github} onChange={handleChange} />

          <button type="submit">{editingId ? "Update Alumni" : "Add Alumni"}</button>
        </form>
      )}

      <div className="alumni-list">
        {filteredAlumni.length > 0 ? (
          filteredAlumni.map((alumnus) => (
            <div key={alumnus.id} className="alumni-card">
              <img
                src={alumnus.profile_pic || "https://via.placeholder.com/120"}
                alt="Profile"
                onError={(e) => (e.target.src = "https://via.placeholder.com/120")}
              />
              <h3>{alumnus.name}</h3>
              <p className="job-title">
                {alumnus.job_title} {alumnus.company && `at ${alumnus.company}`}
              </p>
              <p>{alumnus.bio}</p>
              <p><strong>Graduation Year:</strong> {alumnus.graduation_year || "N/A"}</p>

              <div className="social-links">
                {alumnus.linkedin && (
                  <a href={alumnus.linkedin} target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-linkedin"></i>
                  </a>
                )}
                {alumnus.github && (
                  <a href={alumnus.github} target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-github"></i>
                  </a>
                )}
              </div>

              {currentUser?.id === alumnus.user_id && (
                <div className="button-container">
                  <button className="btn-edit" onClick={() => handleEdit(alumnus)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(alumnus.id, alumnus.user_id)}>Delete</button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No alumni found.</p>
        )}
      </div>
    </div>
  );
}

export default AlumniDirectory;
