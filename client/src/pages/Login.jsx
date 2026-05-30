import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

import "../styles/login.css";
import "../styles/theme.css";

export default function Login() {
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [theme] = useState(localStorage.getItem("theme") || "light");

  // 同步主题
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const register = async () => {
    if (!username.trim() || !password.trim()) {
      alert("用户名和密码不能为空");
      return;
    }
    try {
      const res = await api.post("/register", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);

      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

      alert("注册成功");

      nav("/");
    } catch (err) {
      alert(err.response?.data?.message || "注册失败");
    }
  };

  const login = async () => {
    try {
      const res = await api.post("/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);

      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

      nav("/");
    } catch (err) {
      alert(err.response?.data?.message || "登录失败");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1>ArticleHub</h1>
        <p className="sub">Your personal writing space</p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div className="password-wrapper">
          <input
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            className="toggle-eye"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🐣" : "🐥"}
          </button>
        </div>

        <div className="remember-row">
          <input
            type="checkbox"
            id="remember"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />

          <label htmlFor="remember">Remember me</label>
        </div>

        <button className="login-btn" onClick={login}>
          Login
        </button>

        <button className="register-btn" onClick={register}>
          Register
        </button>
      </div>
    </div>
  );
}
