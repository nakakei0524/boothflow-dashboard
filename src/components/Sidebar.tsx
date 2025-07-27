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

  // レスポンシブ判定
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 700);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ユーザーのプランを判定（仮実装：companyIdに基づく）
  const getUserPlan = () => {
    // 実際の実装では、ユーザーのプラン情報を取得
    // 現在はcompanyIdに基づいて判定
    if (user?.companyId === 'memori.inc') {
      return 'basicPlan';
    } else {
      return 'lightPlan';
    }
  };

  const userPlan = getUserPlan();
  const planFeatures = currentCompany?.planFeatures?.[userPlan as keyof typeof currentCompany.planFeatures] || currentCompany?.planFeatures?.lightPlan;

  // サイドバー本体のスタイル
  const sidebarStyle: React.CSSProperties = isMobile
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: 220,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '2px 0 16px #0002',
        zIndex: 200,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.2s',
        display: 'flex',
        flexDirection: 'column',
      }
    : {
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: 200,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '2px 0 16px #0002',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
      };

  // オーバーレイ
  const overlay = isMobile && isOpen ? (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.25)',
        zIndex: 150,
      }}
      onClick={onToggle}
    />
  ) : null;

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
    <>
      {overlay}
      <aside className={`sidebar${isOpen ? ' open' : ''}`} style={sidebarStyle}>
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
            {(!isMobile && currentCompany?.features.realtimeDashboard) || isMobile ? (
              planFeatures?.realtimeDashboard ? (
                <li
                  className={`nav-item ${location.pathname === "/realtime" ? "active" : ""}`}
                  onClick={() => handleNavClick("/realtime")}
                >
                  リアルタイムダッシュボード
                </li>
              ) : null
            ) : null}
            {(!isMobile && currentCompany?.features.searchDashboard) || isMobile ? (
              <li
                className={`nav-item ${location.pathname === "/search" ? "active" : ""}`}
                onClick={() => handleNavClick("/search")}
              >
                過去データ検索
              </li>
            ) : null}
            {/* プラン別機能制限に基づくメニュー */}
            {planFeatures?.opportunityLoss && (
              <li className="nav-item">機会損失判定</li>
            )}
            {planFeatures?.contactRate && (
              <li className="nav-item">接触率</li>
            )}
            {planFeatures?.opportunityLossGraph && (
              <li className="nav-item">機会損失グラフ</li>
            )}
            {/* スマホ時は他メニュー非表示 */}
            {!isMobile && currentCompany?.features.customReports && (
              <li className="nav-item">カスタムレポート</li>
            )}
            {/* 展示会ROI計算メニュー */}
            <li
              className={`nav-item${location.pathname === "/expo-roi" ? " active" : ""}`}
              onClick={() => alert('近日公開予定（本実装時に画面遷移）')}
              style={{
                color: '#fff',
                cursor: 'pointer',
                position: 'relative',
                opacity: 1,
              }}
            >
              展示会ROI計算
            </li>
            {!isMobile && (
              <>
                <li className="nav-item" onClick={() => handleNavClick("/plan-option")}>プラン・オプション</li>
                <li className="nav-item" onClick={() => handleNavClick("/support")}>サポート</li>
                <li className={`nav-item ${location.pathname === "/admin-settings" ? "active" : ""}`}
                  onClick={() => handleNavClick("/admin-settings")}
                  style={{ color: '#ffd700', fontWeight: 700 }}
                >
                  管理者設定
                </li>
              </>
            )}
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
    </>
  );
};

export default Sidebar;
