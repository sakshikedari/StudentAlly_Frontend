import { useEffect, useState } from "react";
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
});

const ManageSuccessStories = () => {
  const [stories, setStories] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const response = await API.get("/success-stories");
      setStories(response.data);
    } catch (err) {
      setError("Failed to fetch stories");
    } finally {
      setLoading(false);
    }
  };

  const addStory = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !author || !content) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await API.post("/success-stories", { title, author, content });
      setTitle("");
      setAuthor("");
      setContent("");
      fetchStories();
    } catch (err) {
      setError("Failed to add story");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Success Stories</h2>

      <form onSubmit={addStory} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "600px" }}>
        <input
          type="text"
          placeholder="Story Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Author Name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <textarea
          placeholder="Story Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          required
        />
        <button type="submit">Add Story</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? (
        <p>Loading stories...</p>
      ) : (
        <ul style={{ marginTop: "20px" }}>
          {stories.map((story) => (
            <li key={story.id} style={{ marginBottom: "20px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
              <h3>{story.title}</h3>
              <p><strong>By:</strong> {story.author}</p>
              <p>{story.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageSuccessStories;
