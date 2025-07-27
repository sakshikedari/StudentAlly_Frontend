import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./JobPortal.css";

function JobPortal() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    posted_by: "",
    description: "",
    job_link: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    if (storedUser) {
      setNewJob((prev) => ({ ...prev, posted_by: storedUser.name }));
    }

    fetch("http://localhost:5000/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error("Error fetching jobs:", err))
      .finally(() => setLoading(false));
  }, []);

  const handlePostJobClick = () => {
    if (!user) {
      alert("⚠️ Please log in to post a job!");
      navigate("/alumni-login");
      return;
    }
    setShowForm(true);

    setTimeout(() => {
      const formElement = document.querySelector(".job-form");
      if (formElement) {
        formElement.classList.add("active");
      }
    }, 50);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("⚠️ You must be logged in to post a job!");
      navigate("/alumni-login");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newJob),
      });

      if (!response.ok) {
        throw new Error("Failed to post job");
      }

      const addedJob = await response.json();
      setJobs([...jobs, addedJob]);
      setShowForm(false);
      alert("✅ Job posted successfully!");

      setNewJob({
        title: "",
        company: "",
        location: "",
        type: "Full-time",
        posted_by: user.name,
        description: "",
        job_link: "",
      });
    } catch (error) {
      console.error("Error posting job:", error);
      alert("❌ Failed to post job. Please try again.");
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || job.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="job-portal-container">
      <div className="job-hero">
        <h1>Find Your Dream Job</h1>
        <p>Explore job opportunities and kickstart your career!</p>
        <button className="btn-primary" onClick={handlePostJobClick}>
          Post a Job
        </button>
      </div>

      {showForm && (
        <div className="job-form">
          <h2>Post a New Job</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Job Title"
              required
              value={newJob.title}
              onChange={(e) =>
                setNewJob({ ...newJob, title: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Company"
              required
              value={newJob.company}
              onChange={(e) =>
                setNewJob({ ...newJob, company: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Location"
              required
              value={newJob.location}
              onChange={(e) =>
                setNewJob({ ...newJob, location: e.target.value })
              }
            />
            <select
              value={newJob.type}
              onChange={(e) =>
                setNewJob({ ...newJob, type: e.target.value })
              }
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
            <textarea
              placeholder="Job Description"
              required
              value={newJob.description}
              onChange={(e) =>
                setNewJob({ ...newJob, description: e.target.value })
              }
            ></textarea>
            <input
              type="text"
              placeholder="Job Link (Apply Here)"
              required
              value={newJob.job_link}
              onChange={(e) =>
                setNewJob({ ...newJob, job_link: e.target.value })
              }
            />
            <div className="form-buttons">
              <button type="submit" className="btn-primary">
                Submit
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="job-filters">
        <input
          type="text"
          placeholder="Search jobs..."
          className="input-field"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="input-field"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Job Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
        </select>
      </div>

      <div className="job-list">
        {loading ? (
          <p>Loading jobs...</p>
        ) : filteredJobs.length === 0 ? (
          <p>No matching jobs found.</p>
        ) : (
          filteredJobs.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-card-header">
                <div>
                  <h2>{job.title}</h2>
                  <p>{job.company}</p>
                </div>
                <span className="job-type">{job.type}</span>
              </div>
              <p className="job-description">{job.description}</p>
              <div className="job-card-footer">
                <div className="job-details">
                  <p>Location: {job.location}</p>
                  <p>Posted by: {job.posted_by}</p>
                  <p>
                    Posted on:{" "}
                    {new Date(job.posted_date).toLocaleDateString()}
                  </p>
                </div>
                {job.job_link ? (
                  <a
                    href={job.job_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-apply"
                  >
                    Apply Here
                  </a>
                ) : (
                  <p style={{ color: "red", fontWeight: "bold" }}>
                    No Job Link Available
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default JobPortal;
