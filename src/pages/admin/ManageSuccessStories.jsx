import { useEffect, useState } from "react";

const ManageSuccessStories = () => {
  const [stories, setStories] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await fetch("http://localhost:5000/success-stories");
      if (!response.ok) throw new Error("Failed to fetch stories");

      const data = await response.json();
      setStories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const addStory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/success-stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, content }),
      });

      if (!response.ok) throw new Error("Failed to add story");

      fetchStories();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Manage Success Stories</h1>
      <form onSubmit={addStory}>
        <input type="text" placeholder="Story Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="text" placeholder="Author Name" value={author} onChange={(e) => setAuthor(e.target.value)} required />
        <textarea placeholder="Story Content" value={content} onChange={(e) => setContent(e.target.value)} required />
        <button type="submit">Add Story</button>
      </form>
      <ul>
        {stories.map((story) => (
          <li key={story.id}>
            <h3>{story.title}</h3>
            <p>By {story.author}</p>
            <p>{story.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageSuccessStories;
