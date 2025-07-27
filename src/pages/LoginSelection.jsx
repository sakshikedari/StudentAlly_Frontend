import { useNavigate } from "react-router-dom";
import "../../src/pages/LoginSelection.css";

function LoginSelection() {
  const navigate = useNavigate();

  return (
    <div className="login-selection-container">
      <h2>Select Login Type</h2>
      <p>Choose your login category</p>

      <div className="login-buttons">
        <button className="btn-student" onClick={() => navigate("/student-login")}>
          Student Login
        </button>
        <button className="btn-alumni" onClick={() => navigate("/alumni-login")}>
          Alumni Login
        </button>
      </div>
    </div>
  );
}

export default LoginSelection;
