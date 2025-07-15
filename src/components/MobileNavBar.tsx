import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { label: "ホーム", path: "/", icon: "🏠" },
  { label: "過去検索", path: "/search", icon: "🔍" },
  { label: "リアルタイム", path: "/realtime", icon: "📊" },
];

const MobileNavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // スマホ判定
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 700);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  if (!isMobile) return null;

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100vw',
      height: 60,
      background: '#fff',
      borderTop: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 300,
      boxShadow: '0 -2px 8px rgba(0,0,0,0.04)'
    }}>
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          style={{
            background: 'none',
            border: 'none',
            outline: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: location.pathname === item.path ? '#764ba2' : '#444',
            fontWeight: location.pathname === item.path ? 700 : 500,
            fontSize: 15,
            flex: 1,
            padding: 0,
          }}
        >
          <span style={{ fontSize: 24, marginBottom: 2 }}>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default MobileNavBar; 