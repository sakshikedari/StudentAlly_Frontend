import { Link } from 'react-router-dom'
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import './Footer.css' 

function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-grid footer-grid-md">
          <div className="footer-grid-item">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">About Us</Link></li>
              <li><Link to="/">Contact</Link></li>
              <li><Link to="/">Privacy Policy</Link></li>
              <li><Link to="/">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div className="footer-grid-item">
            <h3>Resources</h3>
            <ul>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/jobs">Job Portal</Link></li>
              <li><Link to="/directory">Alumni Directory</Link></li>
              <li><Link to="/donate">Make a Donation</Link></li>
            </ul>
          </div>
          
          <div className="footer-grid-item">
            <h3>Connect With Us</h3>
            <ul>
              <li className="flex">
                <FiMail />
                <a href="mailto:contact@gecalumni.org">contact@stuentalumni.org</a>
              </li>
              <li className="flex">
                <FiPhone />
                <a href="tel:+1234567890">+1 (234) 567-890</a>
              </li>
            </ul>
          </div>
          
          <div className="footer-grid-item">
            <h3>Newsletter</h3>
            <p>Stay updated with alumni news and events.</p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button type="submit" className="btn-primary w-full">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Student Alumni Association. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer