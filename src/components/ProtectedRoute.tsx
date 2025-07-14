import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // ローディング中は必ずローディング画面を表示
  if (isLoading) {
    return (
      <div className="loading-container" style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div>
          <div className="spinner" style={{ 
            width: 60, 
            height: 60, 
            borderWidth: 6, 
            margin: '0 auto 18px' 
          }}></div>
          <div style={{ 
            color: '#fff', 
            fontWeight: 600, 
            fontSize: 20, 
            textAlign: 'center', 
            letterSpacing: 1 
          }}>
            認証状態を確認中...
          </div>
        </div>
      </div>
    );
  }

  // 認証されていない場合はログイン画面を表示
  if (!isAuthenticated) {
    return <Login />;
  }

  // 認証されている場合は子コンポーネントを表示
  return <>{children}</>;
};

export default ProtectedRoute; 