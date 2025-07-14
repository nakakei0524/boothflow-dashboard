import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface CompanyConfig {
  companyId: string;
  companyName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  features: {
    realtimeDashboard: boolean;
    searchDashboard: boolean;
    visitorPanel: boolean;
    customReports: boolean;
  };
  apiEndpoints: {
    baseUrl: string;
    getLatestVisitors: string;
    getDashboardData: string;
    getHourlyVisitors: string;
    getSavedSessions: string;
    getSessionDb: string;
  };
}

interface CompanyContextType {
  currentCompany: CompanyConfig | null;
  isLoading: boolean;
  error: string | null;
  updateCompanyConfig: (config: Partial<CompanyConfig>) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};

interface CompanyProviderProps {
  children: ReactNode;
}

// デフォルトの会社設定
const defaultCompanyConfig: CompanyConfig = {
  companyId: 'memori.inc',
  companyName: 'Memori Inc.',
  primaryColor: '#667eea',
  secondaryColor: '#764ba2',
  features: {
    realtimeDashboard: true,
    searchDashboard: true,
    visitorPanel: true,
    customReports: false,
  },
  apiEndpoints: {
    baseUrl: 'https://tnabm11fyh.execute-api.ap-northeast-1.amazonaws.com/dev',
    getLatestVisitors: 'getLatestVisitors',
    getDashboardData: 'getDashboardData',
    getHourlyVisitors: 'getHourlyVisitors',
    getSavedSessions: 'getSavedSessions',
    getSessionDb: 'getSessionDb',
  },
};

// 会社別の設定マップ
const companyConfigs: Record<string, CompanyConfig> = {
  'memori.inc': {
    ...defaultCompanyConfig,
    companyId: 'memori.inc',
    companyName: 'Memori Inc.',
    logoUrl: '/logo-memori.png',
  },
  'example-corp': {
    ...defaultCompanyConfig,
    companyId: 'example-corp',
    companyName: 'Example Corporation',
    primaryColor: '#e74c3c',
    secondaryColor: '#c0392b',
    logoUrl: '/logo-example.png',
    features: {
      realtimeDashboard: true,
      searchDashboard: true,
      visitorPanel: false,
      customReports: true,
    },
  },
  'demo-company': {
    ...defaultCompanyConfig,
    companyId: 'demo-company',
    companyName: 'Demo Company',
    primaryColor: '#27ae60',
    secondaryColor: '#229954',
    logoUrl: '/logo-demo.png',
    features: {
      realtimeDashboard: false,
      searchDashboard: true,
      visitorPanel: true,
      customReports: false,
    },
  },
};

export const CompanyProvider: React.FC<CompanyProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [currentCompany, setCurrentCompany] = useState<CompanyConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.companyId) {
      loadCompanyConfig(user.companyId);
    } else {
      setCurrentCompany(defaultCompanyConfig);
      setIsLoading(false);
    }
  }, [user?.companyId]);

  const loadCompanyConfig = async (companyId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // 実際の実装では、APIから会社設定を取得
      // 現在はローカルの設定マップを使用
      const config = companyConfigs[companyId] || {
        ...defaultCompanyConfig,
        companyId,
        companyName: `${companyId} Company`,
      };

      setCurrentCompany(config);
    } catch (err) {
      setError('会社設定の読み込みに失敗しました');
      setCurrentCompany(defaultCompanyConfig);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCompanyConfig = (config: Partial<CompanyConfig>) => {
    if (currentCompany) {
      setCurrentCompany({ ...currentCompany, ...config });
    }
  };

  const value: CompanyContextType = {
    currentCompany,
    isLoading,
    error,
    updateCompanyConfig,
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
}; 