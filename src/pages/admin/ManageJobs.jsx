import { useEffect, useState } from "react";
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
});

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Full-Time");
  const [description, setDescription] = useState("");
  const [jobLink, setJobLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await API.get("/jobs");
      setJobs(response.data);
    } catch (err) {
      setError("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const addJob = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !company || !location || !description || !jobLink) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await API.post("/jobs", {
        title,
        company,
        location,
        type,
        description,
        job_link: jobLink,
      });

      setTitle("");
      setCompany("");
      setLocation("");
      setType("Full-Time");
      setDescription("");
      setJobLink("");
      fetchJobs();
    } catch (err) {
      setError("Failed to add job");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Jobs</h2>

      <form onSubmit={addJob} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "600px" }}>
        <input type="text" placeholder="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="text" placeholder="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} required />
        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Internship">Internship</option>
        </select>
        <textarea placeholder="Job Description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} />
        <input type="url" placeholder="Job Link" value={jobLink} onChange={(e) => setJobLink(e.target.value)} required />
        <button type="submit">Add Job</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        <ul style={{ marginTop: "20px" }}>
          {jobs.map((job) => (
            <li key={job.id} style={{ marginBottom: "15px" }}>
              <strong>{job.title}</strong> at <em>{job.company}</em> ({job.type})<br />
              <small>Location:</small> {job.location}<br />
              <small>Description:</small> {job.description}<br />
              <a href={job.job_link} target="_blank" rel="noopener noreferrer">View Job</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageJobs;
