import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../src/pages/SuccessStories.css";

function SuccessStories() {
  const [stories, setStories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [expandedCards, setExpandedCards] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    graduation_year: "",
    title: "",
    image: "",
    summary: "",
    achievements: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    fetch("http://localhost:5000/success-stories")
      .then((res) => res.json())
      .then((data) => setStories(data))
      .catch((err) => console.error("Error fetching stories:", err));
  }, []);

  const handleSubmitClick = () => {
    if (!user) {
      alert("⚠️ Please log in to submit your success story!");
      navigate("/alumni-login");
      return;
    }
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("⚠️ You must be logged in to submit a success story!");
      navigate("/alumni-login");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/success-stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          achievements: formData.achievements
            ? formData.achievements.split(",").map((ach) => ach.trim())
            : [],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit story");
      }

      const newStory = await response.json();
      setStories([...stories, newStory]);
      setShowForm(false);
      setFormData({
        name: "",
        graduation_year: "",
        title: "",
        image: "",
        summary: "",
        achievements: "",
      });
    } catch (error) {
      console.error("Error submitting story:", error);
      setError("Failed to submit. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedCards((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isExpanded = (id) => expandedCards.includes(id);

  return (
    <div className="success-container">
      <div className="success-header">
        <h1>Alumni Success Stories</h1>
        <p>Read inspiring stories of alumni success.</p>
      </div>

      <div className="submit-section">
        {!showForm ? (
          <button onClick={handleSubmitClick}>Submit Your Story</button>
        ) : (
          <form className="success-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name *"
              required
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="number"
              name="graduation_year"
              placeholder="Graduation Year *"
              required
              value={formData.graduation_year}
              onChange={handleChange}
            />
            <input
              type="text"
              name="title"
              placeholder="Title *"
              required
              value={formData.title}
              onChange={handleChange}
            />
            <input
              type="text"
              name="image"
              placeholder="Image URL (optional)"
              value={formData.image}
              onChange={handleChange}
            />
            <textarea
              name="summary"
              placeholder="Summary *"
              required
              value={formData.summary}
              onChange={handleChange}
            ></textarea>
            <input
              type="text"
              name="achievements"
              placeholder="Achievements (comma separated) *"
              required
              value={formData.achievements}
              onChange={handleChange}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
            {error && <p className="error-message">{error}</p>}
          </form>
        )}
      </div>

      {!showForm && (
        <div className="success-grid">
          {stories.map((story) => {
            const achievements = Array.isArray(story.achievements)
              ? story.achievements
              : JSON.parse(story.achievements);
            return (
              <div key={story.id} className="success-card">
                {story.image ? (
                  <img
                    src={story.image}
                    alt={story.name}
                    className="success-image"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ) : (
                  <div className="fallback-image">
                    {story.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="success-content">
                  <h2>
                    {story.name} - {story.graduation_year || "N/A"}
                  </h2>
                  <h3>{story.title}</h3>

                  <p
                    className={`story-summary ${
                      isExpanded(story.id) ? "expanded" : ""
                    }`}
                  >
                    {story.summary}
                  </p>

                  {achievements.length > 0 && (
                    <div className="achievements-wrapper">
                      <h4 className="achievements-title">Achievements</h4>
                      <ul
                        className={`success-achievements ${
                          isExpanded(story.id) ? "expanded" : ""
                        }`}
                      >
                        {achievements.map((ach, index) => (
                          <li key={index}>{ach}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    className="read-more-btn"
                    onClick={() => toggleExpand(story.id)}
                  >
                    {isExpanded(story.id) ? "Show Less" : "Read More"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SuccessStories;
