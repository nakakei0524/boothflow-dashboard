// src/components/Sidebar.tsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCompany } from "../contexts/CompanyContext";
import MobileMenuButton from "./MobileMenuButton";
import logo from "../assets/BflowLogo.png";
import avatar from "../assets/avatar.png";
import "../index.css";

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { currentCompany } = useCompany();

  const handleNavClick = (path: string) => {
    navigate(path);
    // モバイルでメニューを閉じる
    if (onToggle) {
      onToggle();
    }
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
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
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

          {/* 会社設定に基づいてメニューを表示 */}
          {currentCompany?.features.realtimeDashboard && (
            <li
              className={`nav-item ${location.pathname === "/realtime" ? "active" : ""}`}
              onClick={() => handleNavClick("/realtime")}
            >
              ダッシュボード
            </li>
          )}

          {currentCompany?.features.searchDashboard && (
            <li
              className={`nav-item ${location.pathname === "/search" ? "active" : ""}`}
              onClick={() => handleNavClick("/search")}
            >
              過去データ検索
            </li>
          )}

          {currentCompany?.features.customReports && (
            <li className="nav-item">
              カスタムレポート
            </li>
          )}

          <li className="nav-item" onClick={() => handleNavClick("/plan-option")}>プラン・オプション</li>
          <li className="nav-item" onClick={() => handleNavClick("/support")}>サポート</li>
        </ul>
      </nav>
      
      {/* ユーザー情報とログアウト */}
      <div className="sidebar-user" style={{
        background: 'none',
        borderRadius: 0,
        boxShadow: 'none',
        margin: '18px 0 0 0',
        padding: '18px 18px 12px 18px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        border: 'none',
      }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
          <img src={avatar} alt="avatar" style={{ width: 54, height: 54, borderRadius: '50%', objectFit: 'cover', marginRight: 16, boxShadow: '0 2px 8px rgba(102,126,234,0.10)' }} />
          <div className="user-info" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
            <div style={{
              fontSize: '1.08rem',
              fontWeight: 700,
              color: '#fff',
              marginBottom: 6,
              letterSpacing: '0.01em',
              lineHeight: 1.3,
              textShadow: '0 1px 4px rgba(102,126,234,0.10)'
            }}>{user?.companyName || 'Company Name'}</div>
            <div style={{
              fontSize: '0.98rem',
              color: '#e0e7ef',
              fontWeight: 500,
              marginBottom: 2,
              lineHeight: 1.2,
            }}>{user?.attributes?.name || user?.attributes?.["custom:name"] || 'User Name'}</div>
            <div style={{
              fontSize: '0.97rem',
              color: '#cbd5e1',
              fontWeight: 400,
              marginBottom: 2,
              lineHeight: 1.2,
              wordBreak: 'break-all',
            }}>{user?.email}</div>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-button" style={{ marginTop: 16, width: '100%' }}>
          ログアウト
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
