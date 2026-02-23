import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import "../styles/login.css";

interface LoginResponse {
  token: string;
  message?: string;
}

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  // اگر قبلا لاگین کرده بود مستقیم بفرست ادمین
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   // if (token) {
  //   //   navigate("/admin");
  //   // }
  // }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "نام کاربری یا رمز اشتباه است");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/admin");
      } else {
        throw new Error("توکن دریافت نشد");
      }
    } catch (err: any) {
      setError(err.message || "خطا در ارتباط با سرور");
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

        {/* Error */}
        {error && (
          <div className="error-message">
            <FaIcons.FaLock />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">
              <FaIcons.FaUser className="form-icon" />
              نام کاربری
            </label>
            <input
              type="text"
              id="username"
              className="form-input"
              placeholder="نام کاربری خود را وارد کنید"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
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