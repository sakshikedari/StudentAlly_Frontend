import { useEffect, useState } from "react";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Full-Time");
  const [description, setDescription] = useState("");
  const [jobLink, setJobLink] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch("http://localhost:5000/jobs");
      if (!response.ok) throw new Error("Failed to fetch jobs");

      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error(error);
    }
  };

  const addJob = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, company, location, type, description, job_link: jobLink }),
      });

      if (!response.ok) throw new Error("Failed to add job");

      fetchJobs();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Manage Jobs</h1>
      <form onSubmit={addJob}>
        <input type="text" placeholder="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="text" placeholder="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} required />
        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Internship">Internship</option>
        </select>
        <textarea placeholder="Job Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input type="text" placeholder="Job Link" value={jobLink} onChange={(e) => setJobLink(e.target.value)} required />
        <button type="submit">Add Job</button>
      </form>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            {job.title} - {job.company} ({job.type})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageJobs;
