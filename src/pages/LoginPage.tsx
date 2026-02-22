// LoginPage.tsx
import React, { useState, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import "../styles/login.css";
const HOST_URL = !!process.env.REACT_APP_HOST_URL ? process.env.REACT_APP_HOST_URL : '';

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log('Response:', data);

      if (data.token) {
        localStorage.setItem('token', data.token);
        // ریدایرکت به صفحه ادمین
        window.location.href = '/admin'; // یا useNavigate()
      } else {
        setError('خطا در دریافت توکن');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('خطا در ارتباط با سرور');
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