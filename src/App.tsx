// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CompanyProvider, useCompany } from './contexts/CompanyContext';
import ProtectedRoute from './components/ProtectedRoute';
import FeatureRoute from './components/FeatureRoute';
import Sidebar from './components/Sidebar';
import MobileMenuButton from './components/MobileMenuButton';
import SearchDashboard from './components/SearchDashboard';
import Home from './components/Home';
import RealtimeDashboard from './components/RealtimeDashboard';
import PlanOption from './components/PlanOption';

// 追加: 空ページ
const SupportPage = () => <div className="dashboard-main"><h1 className="page-title">サポート</h1></div>;

function AppContent() {
  const { isLoading: authLoading } = useAuth();
  const { isLoading: companyLoading } = useCompany();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    document.title = "BFlow";
  }, []);

  // 認証状態の判定中は必ずローディング画面を表示
  if (authLoading) {
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
            BoothFlow ダッシュボードを読み込み中...
          </div>
        </div>
      </div>
    );
  }

  // 会社情報の読み込み中は軽いローディング表示
  if (companyLoading) {
    return (
      <div className="loading-container" style={{ 
        minHeight: '100vh', 
        background: '#f8f9fa', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div>
          <div className="spinner" style={{ 
            width: 40, 
            height: 40, 
            borderWidth: 4, 
            margin: '0 auto 12px' 
          }}></div>
          <div style={{ 
            color: '#6c757d', 
            fontWeight: 500, 
            fontSize: 16, 
            textAlign: 'center' 
          }}>
            会社情報を読み込み中...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <MobileMenuButton isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <div className="main-content">
        <div className="dashboard-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route 
              path="/search" 
              element={
                <FeatureRoute feature="searchDashboard">
                  <SearchDashboard />
                </FeatureRoute>
              } 
            />
            <Route 
              path="/realtime" 
              element={
                <FeatureRoute feature="realtimeDashboard">
                  <RealtimeDashboard />
                </FeatureRoute>
              } 
            />
            {/* 追加: プラン・オプション、サポート */}
            <Route path="/plan-option" element={<PlanOption />} />
            <Route path="/support" element={<SupportPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CompanyProvider>
        <Router>
          <ProtectedRoute>
            <AppContent />
          </ProtectedRoute>
        </Router>
      </CompanyProvider>
    </AuthProvider>
  );
}

export default App;
