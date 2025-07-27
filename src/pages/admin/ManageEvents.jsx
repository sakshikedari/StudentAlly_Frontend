import { useEffect, useState } from "react";
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
});

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await API.get("/events");
      setEvents(response.data);
    } catch (err) {
      setError("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !date || !location) {
      setError("Please fill all fields");
      return;
    }

    try {
      await API.post("/events", { name, date, location });

      setName("");
      setDate("");
      setLocation("");
      fetchEvents();
    } catch (err) {
      setError("Failed to add event");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Events</h2>

      <form onSubmit={addEvent} style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Event Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <button type="submit">Add Event</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? (
        <p>Loading events...</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <strong>{event.name}</strong> — {new Date(event.date).toLocaleDateString()} at {event.location}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageEvents;
