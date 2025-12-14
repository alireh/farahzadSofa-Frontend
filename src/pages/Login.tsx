import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e:any) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "خطا در ورود");
        return;
      }

      localStorage.setItem("admin_token", data.token);
      navigate("/admin"); // مسیر پنل ادمین
    } catch (err) {
      setError("خطا در اتصال به سرور");
    }
  };

  return (
    <div className="page-container page">
      <main className="main-content">
        <div className="grid">
          <form
            action="https://httpbin.org/post"
            method="POST"
            className="form login"
            onSubmit={handleLogin}
          >
            <div className="form__field">
              <label htmlFor="login__username">
                <svg className="icon">
                  <use xlinkHref="#icon-user" />
                </svg>
              </label>
              <input
                autoComplete="username"
                id="login__username"
                type="text"
                name="username"
                className="form__input"
                placeholder="نام کاربری"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form__field">
              <label htmlFor="login__password">
                <svg className="icon">
                  <use xlinkHref="#icon-lock" />
                </svg>
              </label>
              <input
                id="login__password"
                type="password"
                name="password"
                className="form__input"
                placeholder="کلمه عبور"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form__field">
              <input type="submit" value="ورود" />
            </div>
          </form>
          <p className="text--center">
            اگر قبلا ثبت نام نکرده‌اید <a href="#">ثبت نام کنید</a>
            <svg className="icon">
              <use xlinkHref="#icon-arrow-right" />
            </svg>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;
