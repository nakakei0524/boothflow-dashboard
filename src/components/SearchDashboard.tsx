// src/components/SearchDashboard.tsx
import React, { useState, useCallback, useMemo } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Header from "./Header";
import SummaryCards from "./SummaryCards";
import GraphPanel from "./GraphPanel";
import SavedSessionsModal from "./SavedSessionsModal";
import { useAuth } from "../contexts/AuthContext";
import { useCompany } from "../contexts/CompanyContext";
import "../index.css";
import MobileMenuButton from "./MobileMenuButton";
import MobileNavBar from "./MobileNavBar";
import MobileLayout from "./MobileLayout";

interface DashboardStats {
  total_visitors: number;
  contacted_count: number;
  lost_opportunities: number;
  passed_count: number;
  contact_rate: number;
  average_duration: number;
}

interface HourlyData {
  hour: string;
  count: number;
  contact: number;
  lost: number;
}

const dummyStats: DashboardStats = {
  total_visitors: 0,
  contacted_count: 0,
  lost_opportunities: 0,
  passed_count: 0,
  contact_rate: 0,
  average_duration: 0,
};

const SearchDashboard: React.FC = React.memo(() => {
  const { user } = useAuth();
  const { currentCompany } = useCompany();
  const [stats, setStats] = useState<DashboardStats>(dummyStats);
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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

  // モーダル表示時はサイドバーを閉じる
  React.useEffect(() => {
    if (isModalOpen && sidebarOpen && isMobile) {
      setSidebarOpen(false);
    }
  }, [isModalOpen, isMobile, sidebarOpen]);

  // デバッグ用
  console.log('SearchDashboard - isModalOpen:', isModalOpen);

  const fetchStats = useCallback(async (
    _sessionKeyword: string,
    startDate: string,
    endDate: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const companyId = user?.companyId || currentCompany?.companyId || "memori.inc";
      
      // デバッグ: APIリクエスト時のcompany_idをログ出力
      console.log('=== API Request Debug ===');
      console.log('User Company ID:', user?.companyId);
      console.log('Current Company ID:', currentCompany?.companyId);
      console.log('Final Company ID for API:', companyId);
      console.log('API Endpoint:', `${currentCompany?.apiEndpoints.baseUrl}/${currentCompany?.apiEndpoints.getDashboardData}`);
      console.log('Request Params:', {
        company_id: companyId,
        start_date: startDate,
        end_date: endDate,
      });

      const statsRes = await axios.get(
        `${currentCompany?.apiEndpoints.baseUrl}/${currentCompany?.apiEndpoints.getDashboardData}`,
        {
          params: {
            company_id: companyId,
            start_date: startDate,
            end_date: endDate,
          },
        }
      );
      setStats(statsRes.data);

      const hourlyRes = await axios.get(
        `${currentCompany?.apiEndpoints.baseUrl}/${currentCompany?.apiEndpoints.getHourlyVisitors}`,
        {
          params: {
            company_id: companyId,
            start_date: startDate,
            end_date: endDate,
          },
        }
      );

      const raw = hourlyRes.data.hourly_visitors;

      const transformed: HourlyData[] = Object.entries(raw).map(
        ([hour, value]) => {
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
        }
      );

      // ✅ 時間帯（9〜18時）をすべて含むように補完
      const completeData: HourlyData[] = Array.from({ length: 10 }, (_, i) => {
        const hour = (i + 9).toString();
        const match = transformed.find((d) => d.hour === hour);
        return match || { hour, count: 0, contact: 0, lost: 0 };
      });

      setHourlyData(completeData);
    } catch (err: any) {
      console.error("APIエラー:", err);
      if (err.response) {
        // APIからのエラーレスポンス
        if (err.response.status === 401) {
          setError('認証エラーです。ログインし直してください。');
        } else if (err.response.status === 403) {
          setError('アクセス権限がありません。');
        } else if (err.response.status === 404) {
          setError('指定されたデータが見つかりません。');
        } else if (err.response.status >= 500) {
          setError('サーバーエラーが発生しました。しばらく時間をおいてから再試行してください。');
        } else {
          setError(`APIエラー: ${err.response.data?.message || err.response.statusText}`);
        }
      } else if (err.request) {
        // ネットワークエラー
        setError('ネットワークエラーが発生しました。インターネット接続をご確認ください。');
      } else {
        // その他のエラー
      setError(err.message || "データ取得に失敗しました");
      }
      setStats(dummyStats);
      setHourlyData([]);
    } finally {
      setLoading(false);
    }
  }, [user?.companyId, currentCompany]);

  // 過去データ一覧からセッションを選択した時の処理
  const handleSessionSelect = useCallback((sessionId: string, baseDate: string) => {
    // 会期名と日付を設定してデータを取得
    fetchStats(sessionId, baseDate, baseDate);
  }, [fetchStats]);

  // メモ化されたデータ
  const memoizedStats = useMemo(() => ({
              total_visitors: stats.total_visitors,
              contact_count: stats.contacted_count,
              lost_count: stats.lost_opportunities,
              pass_count: stats.passed_count,
              contact_rate: stats.contact_rate,
              avg_stay_time: stats.average_duration / 60,
  }), [stats]);

  // スマホ専用デザイン
  if (isMobile) {
    return (
      <MobileLayout title="過去データ検索">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* 検索フォーム */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px #bdbdbd22' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ fontWeight: 600, fontSize: 15 }}>会期名</label>
              <input
                type="text"
                placeholder="キーワード"
                style={{ fontSize: 16, padding: 10, borderRadius: 6, border: '1px solid #ccc', marginBottom: 8 }}
                value={''}
                onChange={() => {}}
                readOnly
                // 本来はHeaderのstateと連携するが、ここではダミー
              />
              <label style={{ fontWeight: 600, fontSize: 15 }}>日付</label>
              <input
                type="date"
                style={{ fontSize: 16, padding: 10, borderRadius: 6, border: '1px solid #ccc', marginBottom: 8 }}
                value={''}
                onChange={() => {}}
                readOnly
              />
              <button
                style={{ width: '100%', background: 'linear-gradient(90deg, #764ba2 0%, #667eea 100%)', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 8, padding: '12px 0', marginTop: 8 }}
                onClick={() => {}}
                disabled
              >
                検索（スマホUI例）
              </button>
              <button
                style={{ width: '100%', background: '#28a745', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 8, padding: '12px 0', marginTop: 8 }}
                onClick={() => setIsModalOpen(true)}
              >
                📋 保存データ一覧
              </button>
            </div>
          </div>
          {/* サマリーカード */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 12, boxShadow: '0 2px 8px #bdbdbd22' }}>
            <SummaryCards data={memoizedStats} />
          </div>
          {/* グラフ */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 12, boxShadow: '0 2px 8px #bdbdbd22' }}>
            <GraphPanel data={hourlyData} id="search-mobile" />
          </div>
          {/* エラー表示 */}
          {error && <p style={{ color: '#e11d48', fontWeight: 600, textAlign: 'center', margin: 0 }}>{error}</p>}
        </div>
        {isModalOpen && (
          <SavedSessionsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelectSession={handleSessionSelect} />
        )}
      </MobileLayout>
    );
  }

  // PC用デザイン（従来通り）
  return (
    <div className="dashboard-container" style={{ position: 'relative', display: 'flex' }}>
      {loading && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(255,255,255,0.65)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div>
            <div className="spinner" style={{ width: 48, height: 48, borderWidth: 5, margin: '0 auto 12px' }}></div>
            <div style={{ color: '#667eea', fontWeight: 600, fontSize: 16, textAlign: 'center' }}>データを取得中...</div>
          </div>
        </div>
      )}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />
      <div
        className="dashboard-main"
        style={{
          transition: 'margin-left 0.2s',
          flex: 1,
          maxWidth: 1000,
          margin: '0 auto',
          minWidth: 0,
        }}
      >
        {/* モバイル時のみメニューボタン表示 */}
        {isMobile && (
          <div style={{ position: 'fixed', top: 16, left: 16, zIndex: 120 }}>
            <MobileMenuButton isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />
          </div>
        )}
        <h1 className="page-title">過去データ検索</h1>
        <Header onSearch={fetchStats} onShowSavedSessions={() => setIsModalOpen(true)} />
        {error && <p className="status-message error">{error}</p>}
        <div className="card-grid">
          <SummaryCards data={memoizedStats} />
        </div>
        <div className="box-section">
          <GraphPanel data={hourlyData} id="search" />
        </div>
        {isModalOpen && (
          <SavedSessionsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelectSession={handleSessionSelect} />
        )}
      </div>
      <MobileNavBar />
    </div>
  );
});

SearchDashboard.displayName = 'SearchDashboard';

export default SearchDashboard;
