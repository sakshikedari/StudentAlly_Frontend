import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api";
import { FiEye, FiEyeOff } from "react-icons/fi"; // Eye icons
import "./Register.css";

function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await registerUser(data);
      console.log("Registration Successful:", response);
      alert("Account created! Please log in."); 
      navigate("/login-selection"); 
    } catch (error) {
      console.error("Registration error:", error);
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-header">
          <h2>Join GEC Alumni Network</h2>
          <p>Create your alumni account</p>
        </div>

        <div className="register-form-container">
          <form onSubmit={handleSubmit(onSubmit)} className="register-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                {...register("name", { required: "Full name is required" })}
                type="text"
                className="input-field"
              />
              {errors.name && <p className="error">{errors.name.message}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                type="email"
                className="input-field"
              />
              {errors.email && <p className="error">{errors.email.message}</p>}
            </div>

            {/* Password Field with Eye Icon */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-field">
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  type={showPassword ? "text" : "password"} // Toggle password visibility
                  className="input-field"
                />
                <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
              {errors.password && <p className="error">{errors.password.message}</p>}
            </div>

            {/* Confirm Password Field with Eye Icon */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-field">
                <input
                  {...register("confirmPassword", {
                    required: "Confirm your password",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                  type={showConfirmPassword ? "text" : "password"} // Toggle confirm password visibility
                  className="input-field"
                />
                <span className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
              {errors.confirmPassword && <p className="error">{errors.confirmPassword.message}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="graduationYear">Graduation Year</label>
              <input
                {...register("graduationYear", {
                  required: "Graduation year is required",
                  min: { value: 1950, message: "Invalid graduation year" },
                  max: { value: new Date().getFullYear(), message: "Invalid graduation year" },
                })}
                type="number"
                className="input-field"
              />
              {errors.graduationYear && <p className="error">{errors.graduationYear.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="register-footer">
            <p>
              Already have an account?{" "}
              <Link to="/login-selection" className="login-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
