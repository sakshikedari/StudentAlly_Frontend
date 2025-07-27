import { Link } from "react-router-dom";
import "./Home.css"; 
import successImage from "../../src/pages/success.jpg";
import meetImage from "../../src/pages/meet.jpg";
import { useEffect } from "react";

function Home() {
  useEffect(() => {
    const sections = document.querySelectorAll(".section");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.2 });

    sections.forEach((section) => observer.observe(section));
    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content container text-center">
          <h1>Welcome to Student Alumni Association</h1>
          <p>Connecting generations of excellence</p>
          <div className="btn-group">
            <Link to="/register" className="btn-primary">Join Now</Link>
            <Link to="/donate" className="btn-secondary">Support GEC</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid">
            <div className="card">
              <img src={successImage} alt="Alumni" className="card-img" />
              <h3>John Doe</h3>
              <p>CEO, Tech Innovations Inc.</p>
              <Link to="/success-stories" className="card-link">Read More →</Link>
            </div>
          </div>
        </div>
      </section>


      <section className="section bg-gray">
        <div className="container">
          <h2>Upcoming Events</h2>
          <div className="grid">
            <div className="card event-card">
              <div className="event-date">
                <div className="event-day">15</div>
                <div>MAR</div>
              </div>
              <div>
                <h3>Annual Alumni Meet 2025</h3>
                <p>Join us for a day of networking and celebration with fellow alumni.</p>
                <Link to="/events" className="card-link">Learn More →</Link>
              </div>
              <img src={meetImage} alt="Alumni" className="event-img" />
            </div>
          </div>
        </div>
      </section>


      <section className="impact-section section">
        <div className="container text-center">
          <h2>Why Join Us?</h2>
          <div className="impact-cards">
            <div className="impact-card">
              <h3>Stay Connected</h3>
              <p>Reunite with classmates and mentors from your college days, and never miss an update!</p>
            </div>
            <div className="impact-card">
              <h3>Inspire & Mentor</h3>
              <p>Give back by guiding the next generation of students through mentorship and career advice.</p>
            </div>
            <div className="impact-card">
              <h3>Exclusive Access</h3>
              <p>Be the first to know about alumni events, job postings, success stories, and donation drives.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="section">
        <div className="container">
          <h2>Quick Links</h2>
          <div className="grid quick-links">
            <Link to="/directory" className="card">Alumni Directory</Link>
            <Link to="/jobs" className="card">Job Portal</Link>
            <Link to="/events" className="card">Events</Link>
            <Link to="/donate" className="card">Donate</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
