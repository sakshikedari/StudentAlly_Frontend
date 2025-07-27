import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import "./Events.css";

function Events() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); 

  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    type: "In-person",
    image: "",
    description: "",
    registration_deadline: "",
    capacity: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    fetch("http://localhost:5000/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  const handleAddEventClick = () => {
    if (!user) {
      alert("⚠️ Please log in to add an event!");
      navigate("/alumni-login");
      return;
    }
    setShowForm(true);
  };

  const handleRegister = () => {
    if (!user) {
      alert("⚠️ Please log in to register for an event!");
      navigate("/alumni-login");
      return;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("⚠️ You must be logged in to add an event!");
      navigate("/alumni-login");
      return;
    }

    const eventToSubmit = {
      ...newEvent,
      image: newEvent.image || "https://placehold.co/400x200",
      registration_deadline: newEvent.registration_deadline || newEvent.date,
    };

    try {
      const response = await fetch("http://localhost:5000/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventToSubmit),
      });

      if (!response.ok) {
        throw new Error("Failed to add event");
      }

      const addedEvent = await response.json();
      setEvents([...events, addedEvent]);
      setShowForm(false);
      setNewEvent({
        title: "",
        date: "",
        time: "",
        location: "",
        type: "In-person",
        description: "",
        registration_deadline: "",
        capacity: "",
        image: "",
      });
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  return (
    <div className="events-container">
      <div className="events-header">
        <h1 className="events-title">Events</h1>
        <button className="btn-primary" onClick={handleAddEventClick}>Add Event</button>
      </div>

      {showForm ? (
        <div className="event-form">
          <h2>Add New Event</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Event Title" required value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
            <input type="date" required value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
            <input type="time" required value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} />
            <input type="text" placeholder="Location" required value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} />
            <select value={newEvent.type} onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}>
              <option value="In-person">In-person</option>
              <option value="Online">Online</option>
            </select>
            <input type="text" placeholder="Image URL" required value={newEvent.image} onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })} />
            <textarea placeholder="Description" required value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}></textarea>
            <input type="date" required value={newEvent.registration_deadline} onChange={(e) => setNewEvent({ ...newEvent, registration_deadline: e.target.value })} />
            <input type="number" placeholder="Capacity" required value={newEvent.capacity} onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })} />
            <div className="form-buttons">
              <button type="submit" className="btn-primary">Submit</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <img src={event.image} alt={event.title} className="event-image" />
              <div className="event-content">
                <h2>{event.title}</h2>
                <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()} at {event.time}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Type:</strong> {event.type}</p>
                <p className="event-description">{event.description}</p>
                <p><strong>Registration Deadline:</strong> {new Date(event.registration_deadline).toLocaleDateString()}</p>
                
                <button className="btn-primary" onClick={handleRegister}>
                  Register Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Events;
