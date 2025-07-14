// src/components/Sidebar.tsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/BflowLogo.png";
import "../index.css";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="Bflow Logo" className="sidebar-logo-img" />
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li
            className={`nav-item ${location.pathname === "/" || location.pathname === "/home" ? "active" : ""}`}
            onClick={() => handleNavClick("/")}
          >
            ホーム
          </li>

          {/* ✅ ダッシュボード → /realtime に遷移 */}
          <li
            className={`nav-item ${location.pathname === "/realtime" ? "active" : ""}`}
            onClick={() => handleNavClick("/realtime")}
          >
            ダッシュボード
          </li>

          <li
            className={`nav-item ${location.pathname === "/search" ? "active" : ""}`}
            onClick={() => handleNavClick("/search")}
          >
            過去データ検索
          </li>

          {/* 🟥 「リアルタイム来場表示」は削除済み */}

          <li className="nav-item">プラン・オプション</li>
          <li className="nav-item">サポート</li>
        </ul>
      </nav>
      
      {/* ユーザー情報とログアウト */}
      <div className="sidebar-user">
        <div className="user-info">
          <p className="user-email">{user?.email}</p>
          <p className="user-company">{user?.companyId}</p>
        </div>
        <button onClick={handleLogout} className="logout-button">
          ログアウト
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
