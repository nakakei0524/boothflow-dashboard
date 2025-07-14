import React, { useState } from "react";
import { signIn } from "aws-amplify/auth";
import "../index.css";
import logo from "../assets/BflowLogo.png";

const CustomLogin: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn({ username: email, password });
      onSuccess();
    } catch (err: any) {
      setError("メールアドレスまたはパスワードが正しくありません");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="custom-login-bg">
      <form className="custom-login-card" onSubmit={handleLogin}>
        <div className="custom-login-logo">
          <img src={logo} alt="Bflow Logo" style={{ height: 48 }} />
        </div>
        <h2 className="custom-login-title">ログイン</h2>
        <p className="custom-login-desc">
          BoothFlowダッシュボードをご利用いただくにはアカウントでログインしてください。
        </p>
        <div className="custom-login-field">
          <label className="custom-login-label">メールアドレス</label>
          <input
            type="email"
            className={`custom-login-input${error ? " error" : ""}`}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div className="custom-login-field">
          <label className="custom-login-label">パスワード</label>
          <div className="custom-login-password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              className={`custom-login-input${error ? " error" : ""}`}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <span
              className="custom-login-eye"
              onClick={() => setShowPassword(v => !v)}
              tabIndex={0}
              role="button"
              aria-label="パスワード表示切替"
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </div>
        {error && <div className="custom-login-error">{error}</div>}
        <div className="custom-login-links">
          <a href="#" className="custom-login-link" style={{ color: "#e53935" }}>
            パスワードをお忘れですか？
          </a>
        </div>
        <button
          type="submit"
          className="custom-login-btn"
          disabled={loading || !email || !password}
        >
          {loading ? "ログイン中..." : "続ける"}
        </button>
        <div className="custom-login-bottom">
          アカウントが未登録ですか？
          <a href="#" className="custom-login-link"> アカウントの作成</a>
        </div>
      </form>
      <footer className="custom-login-footer">
        <a href="#" className="custom-login-footer-link">プライバシーポリシー</a>
        <span>・</span>
        <a href="#" className="custom-login-footer-link">利用規約</a>
        <span>・</span>
        <a href="#" className="custom-login-footer-link">会員規約</a>
      </footer>
    </div>
  );
};

export default CustomLogin; 