// ✅ ファイル名：src/components/dashboard.tsx
import React, { useState } from "react";
import axios from "axios";
import Header from "./Header";
import VisitorList from "./VisitorList";
import GraphPanel from "./GraphPanel";
import Sidebar from "./Sidebar";
import MobileMenuButton from "./MobileMenuButton";
import { useAuth } from "../contexts/AuthContext";
import { useCompany } from "../contexts/CompanyContext";

interface DashboardStats {
  total_visitors: number;
  contacted_count: number;
  lost_opportunities: number;
  passed_count: number;
  stayed_count: number;
  contact_rate: number;
  average_duration: number;
}

interface HourlyData {
  hour: string;
  count: number;
  contact: number;
  lost: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { currentCompany } = useCompany();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // ユーザーのプランを判定（仮実装：companyIdに基づく）
  const getUserPlan = () => {
    // テスト用に一時的にライトプランに設定
    return 'lightPlan';
    
    // 元のロジック（コメントアウト）
    // if (user?.companyId === 'memori.inc') {
    //   return 'basicPlan';
    // } else if (user?.companyId === 'enterprise') {
    //   return 'enterprisePlan';
    // } else {
    //   return 'lightPlan';
    // }
  };

  const userPlan = getUserPlan();
  const planFeatures = currentCompany?.planFeatures?.[userPlan as keyof typeof currentCompany.planFeatures] || currentCompany?.planFeatures?.lightPlan;

  // デバッグ情報をコンソールに出力
  console.log('=== Dashboard Debug ===');
  console.log('User Company ID:', user?.companyId);
  console.log('Current Plan:', userPlan);
  console.log('Plan Features:', planFeatures);
  console.log('Opportunity Loss Enabled:', planFeatures?.opportunityLoss);
  console.log('Contact Rate Enabled:', planFeatures?.contactRate);
  console.log('Hourly Graph Enabled:', planFeatures?.hourlyGraph);
  console.log('Opportunity Loss Graph Enabled:', planFeatures?.opportunityLossGraph);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 700);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // サイドバーをモバイル時はデフォルト非表示に
  React.useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const fetchStats = async (
    _sessionKeyword: string,
    startDate: string,
    _endDate: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const companyId = user?.companyId || currentCompany?.companyId || "memori.inc";

      const statsRes = await axios.get(
        `${currentCompany?.apiEndpoints.baseUrl}/${currentCompany?.apiEndpoints.getDashboardData}`,
        {
          params: {
            company_id: companyId,
            date: startDate,
          },
        }
      );
      setStats(statsRes.data);

      const hourlyRes = await axios.get(
        `${currentCompany?.apiEndpoints.baseUrl}/${currentCompany?.apiEndpoints.getHourlyVisitors}`,
        {
          params: {
            company_id: companyId,
            date: startDate,
          },
        }
      );

      const raw = hourlyRes.data.hourly_visitors;

      const transformed: HourlyData[] = Object.entries(raw).map(([hour, value]) => {
        if (value !== null && typeof value === "object" && "count" in value) {
          return {
            hour,
            count: Number((value as any).count),
            contact: "contact" in value ? Number((value as any).contact) : 0,
            lost: "lost" in value ? Number((value as any).lost) : 0,
          };
        } else {
          return {
            hour,
            count: Number(value),
            contact: 0,
            lost: 0,
          };
        }
      });

      setHourlyData(transformed);
    } catch (err: any) {
      console.error("APIエラー:", err);
      setError(err.message || "データ取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", position: 'relative' }}>
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />
      <div
        style={{
          marginLeft: !isMobile && sidebarOpen ? "200px" : 0,
          padding: "20px",
          flex: 1,
          transition: 'margin-left 0.2s',
        }}
      >
        {/* モバイル時のみメニューボタン表示 */}
        {isMobile && (
          <div style={{ position: 'fixed', top: 16, left: 16, zIndex: 120 }}>
            <MobileMenuButton isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />
          </div>
        )}
        <Header onSearch={fetchStats} />
        <main className="main-content">
          {loading && <p className="text-center">読み込み中...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {stats && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <VisitorList stats={stats} />
              {/* プラン制限に基づく機能表示 */}
              <div className="bg-white p-6 rounded-lg shadow" style={!planFeatures?.opportunityLoss ? { opacity: 0.5, background: '#eee' } : {}}>
                <h3 className="text-lg font-semibold mb-4">機会損失判定</h3>
                <p className="text-gray-600">機会損失: {planFeatures?.opportunityLoss ? stats.lost_opportunities : '-'}件</p>
                {!planFeatures?.opportunityLoss && (
                  <div style={{ 
                    background: '#ff6b6b', 
                    color: '#fff', 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px', 
                    fontWeight: '600',
                    marginTop: '8px',
                    display: 'inline-block'
                  }}>
                    このプランでは使えません
                  </div>
                )}
              </div>
              <div className="bg-white p-6 rounded-lg shadow" style={!planFeatures?.contactRate ? { opacity: 0.5, background: '#eee' } : {}}>
                <h3 className="text-lg font-semibold mb-4">接触率</h3>
                <p className="text-gray-600">接触率: {planFeatures?.contactRate ? `${stats.contact_rate}%` : '-'}</p>
                {!planFeatures?.contactRate && (
                  <div style={{ 
                    background: '#ff6b6b', 
                    color: '#fff', 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px', 
                    fontWeight: '600',
                    marginTop: '8px',
                    display: 'inline-block'
                  }}>
                    このプランでは使えません
                  </div>
                )}
              </div>
            </div>
          )}
          {hourlyData.length > 0 && (
            <div className="grid grid-cols-1">
              <div style={!planFeatures?.hourlyGraph ? { opacity: 0.5, background: '#eee' } : {}}>
              <GraphPanel data={hourlyData} />
                {!planFeatures?.hourlyGraph && (
                  <div style={{ 
                    background: '#ff6b6b', 
                    color: '#fff', 
                    padding: '8px 12px', 
                    borderRadius: '6px', 
                    fontSize: '14px', 
                    fontWeight: '600',
                    marginTop: '12px',
                    textAlign: 'center'
                  }}>
                    このプランでは使えません
                  </div>
                )}
              </div>
            </div>
          )}
          {hourlyData.length > 0 && (
            <div className="grid grid-cols-1 mt-6">
              <div className="bg-white p-6 rounded-lg shadow" style={!planFeatures?.opportunityLossGraph ? { opacity: 0.5, background: '#eee' } : {}}>
                <h3 className="text-lg font-semibold mb-4">機会損失グラフ</h3>
                <p className="text-gray-600">機会損失の時間帯別グラフがここに表示されます</p>
                {!planFeatures?.opportunityLossGraph && (
                  <div style={{ 
                    background: '#ff6b6b', 
                    color: '#fff', 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px', 
                    fontWeight: '600',
                    marginTop: '8px',
                    display: 'inline-block'
                  }}>
                    このプランでは使えません
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
