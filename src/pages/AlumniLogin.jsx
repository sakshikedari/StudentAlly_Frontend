import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api.js"; 
import { FiEye, FiEyeOff } from "react-icons/fi"; 
import "./Login.css";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const loginPayload = {
        email: data.email.trim(), 
        password: data.password.trim(),
      };

      const response = await loginUser(loginPayload);
      console.log("Login Successful:", response);

      if (response.token) {
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));

        window.dispatchEvent(new Event("userUpdated"));

        navigate("/"); 
      } else {
        throw new Error("Token not received");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(
        error.response?.data?.error || "Invalid email or password"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your alumni account</p>
        </div>

        <div className="login-form-container">
          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
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

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-field">
                <input
                  {...register("password", { required: "Password is required" })}
                  type={showPassword ? "text" : "password"} // Toggle input type
                  className="input-field"
                />
                <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FiEyeOff /> : <FiEye />} {/* Toggle icon */}
                </span>
              </div>
              {errors.password && <p className="error">{errors.password.message}</p>}
            </div>

            {errorMessage && <p className="error">{errorMessage}</p>}

            <div className="login-options">
              <div className="remember-me">
                <input {...register("remember")} type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>

              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="register-link">
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
