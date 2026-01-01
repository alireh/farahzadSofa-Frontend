// LoginPage.tsx
import React, { useState, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import "../styles/login.css";

// Define interface for login response
interface LoginResponse {
  token: string;
  message?: string;
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post<LoginResponse>(
        `${process.env.REACT_APP_HOST_URL}/api/admin/login`,
        {
          email,
          password,
        }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/admin");
      } else {
        setError("خطا در دریافت توکن");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data?.message ||
          "نام کاربری یا کلمه عبور اشتباه است"
        );
      } else {
        setError("خطا در ارتباط با سرور");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Header */}
        <div className="login-header">
          <div className="logo-wrapper">
            <img src="/images/logo192.jpg" alt="مبل فرحزاد" />
            <div>
              <h1 className="login-title">پنل مدیریتی مبل فرحزاد</h1>
              <p className="login-subtitle">ورود به بخش مدیریت سایت</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <FaIcons.FaLock />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">
              <FaIcons.FaUser className="form-icon" />
              نام کاربری
            </label>
            <input
              type="text"
              id="email"
              className="form-input"
              placeholder="نام کاربری خود را وارد کنید"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <FaIcons.FaUser className="input-icon" />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <FaIcons.FaLock className="form-icon" />
              کلمه عبور
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="کلمه عبور خود را وارد کنید"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <FaIcons.FaLock className="input-icon" />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <div className="loading-spinner"></div>
                در حال ورود...
              </>
            ) : (
              <>
                ورود به پنل
                <FaIcons.FaArrowRight />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <a href="/" className="back-link">
            <FaIcons.FaHome />
            بازگشت به صفحه اصلی
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;