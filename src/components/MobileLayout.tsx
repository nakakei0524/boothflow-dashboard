import React from "react";
import MobileNavBar from "./MobileNavBar";

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children, title }) => {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 700);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  if (!isMobile) return null;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: 60, // MobileNavBar分
    }}>
      {title && (
        <div style={{
          height: 52,
          background: 'linear-gradient(90deg, #764ba2 0%, #667eea 100%)',
          color: '#fff',
          fontWeight: 700,
          fontSize: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          letterSpacing: 1,
          boxShadow: '0 2px 8px #bdbdbd22',
        }}>{title}</div>
      )}
      <div style={{ flex: 1, padding: '16px 8px 0 8px', width: '100%' }}>
        {children}
      </div>
      <MobileNavBar />
    </div>
  );
};

export default MobileLayout; 