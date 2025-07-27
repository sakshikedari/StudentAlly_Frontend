import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./donate.css";

function Donate() {
  const [donations, setDonations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showMentorshipForm, setShowMentorshipForm] = useState(false);
  const [showMoreMentorship, setShowMoreMentorship] = useState(false);
  const [showMoreDonation, setShowMoreDonation] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await fetch("http://localhost:5000/donations");
      const data = await response.json();
      setDonations(data);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  const handleCreateDonation = () => {
    if (!user) {
      alert("⚠️ Please log in to create a donation initiative!");
      navigate("/alumni-login");
      return;
    }
    setShowForm(!showForm);
  };

  const handleOfferMentorship = () => {
    if (!user) {
      alert("⚠️ Please log in to offer a mentorship session!");
      navigate("/alumni-login");
      return;
    }
    setShowMentorshipForm(!showMentorshipForm);
  };

  const handleDonate = () => {
    if (!user) {
      alert("⚠️ Please log in to make a donation!");
      navigate("/alumni-login");
      return;
    }
  };

  return (
    <div className="donate-container">
      <div className="donate-header">
        <h1 className="donate-title">Support GEC</h1>
        <p className="donate-description">
          Your contribution helps shape the future of education and innovation at GEC.
        </p>

        <button className="btn-primary add-donation-button" onClick={handleCreateDonation}>
          {showForm ? "Close Form" : "Create Donation"}
        </button>
        <button className="btn-primary add-mentorship-button" onClick={handleOfferMentorship}>
          {showMentorshipForm ? "Close Mentorship Form" : "Offer Mentorship"}
        </button>
      </div>

      <div className="info-box-container">
        <div className="info-box">
          <h2>Why Mentorship Matters?</h2>
          <p>
            Mentorship helps students gain industry insights, career guidance, and networking opportunities.
            {showMoreMentorship && (
              <> Experienced mentors provide real-world knowledge, helping students navigate their careers effectively.</>
            )}
          </p>
          <button className="read-more-button" onClick={() => setShowMoreMentorship(!showMoreMentorship)}>
            {showMoreMentorship ? "Read Less" : "Read More"}
          </button>
        </div>

        <div className="info-box">
          <h2>Why Donate?</h2>
          <p>
            Donations support scholarships, research projects, and better facilities for students.
            {showMoreDonation && (
              <> Your contributions directly impact students' education, ensuring access to valuable resources.</>
            )}
          </p>
          <button className="read-more-button" onClick={() => setShowMoreDonation(!showMoreDonation)}>
            {showMoreDonation ? "Read Less" : "Read More"}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="donation-form">
          <h2>Create a Donation Initiative</h2>
          <form>
            <input type="text" placeholder="Title" required />
            <textarea placeholder="Description" required />
            <input type="number" placeholder="Goal Amount (₹)" required />
            <input type="text" placeholder="Image URL" required />
            <input type="text" placeholder="Mobile Number (for Alumni)" />
            <select>
              <option value="Student">Student</option>
              <option value="Alumni">Alumni</option>
            </select>
            <button type="submit" className="btn-primary">Submit</button>
          </form>
        </div>
      )}

      {showMentorshipForm && (
        <div className="mentorship-form">
          <h2>Offer a Mentorship Session</h2>
          <form>
            <input type="text" placeholder="Your Name" required />
            <input type="text" placeholder="Expertise" required />
            <input type="text" placeholder="Available Time Slots" required />
            <textarea placeholder="Brief Description" required></textarea>
            <button type="submit" className="btn-primary">Submit</button>
          </form>
        </div>
      )}

      <div className="donate-grid">
        {donations.map((initiative) => (
          <div key={initiative.id} className="donate-card">
            <img src={initiative.image} alt={initiative.title} className="donate-image" />
            <h2 className="donate-card-title">{initiative.title}</h2>
            <p className="donate-card-description">{initiative.description}</p>

            <div className="donate-progress">
              <div className="progress-info">
                <span>Progress</span>
                <span>₹{initiative.raised?.toLocaleString()} / ₹{initiative.goal?.toLocaleString()}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(initiative.raised / initiative.goal) * 100}%` }}
                ></div>
              </div>
            </div>

            <button className="btn-primary donate-button" onClick={handleDonate}>
              Donate ₹5000
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Donate;
