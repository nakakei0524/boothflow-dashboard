// src/components/RealtimeDashboard.tsx
import React, { useState } from "react";
import SummaryCards from "./SummaryCards";
import GraphPanel from "./GraphPanel";
import RealtimeSearchBar from "./RealtimeSearchBar";
import { useAuth } from "../contexts/AuthContext";
import { useCompany } from "../contexts/CompanyContext";
import axios from "axios";

const RealtimeDashboard: React.FC = () => {
  const { user } = useAuth();
  const { currentCompany } = useCompany();
  const [sessionId, setSessionId] = useState("");
  const [baseDate, setBaseDate] = useState("");
  const [summaryData, setSummaryData] = useState({
    totalVisitors: 0,
    contacted: 0,
    lost: 0,
    passed: 0,
    contactRate: 0,
    averageDuration: 0,
  });
  const [hourlyData, setHourlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // データの比較関数
  const isDataEqual = (oldData: any[], newData: any[]) => {
    if (oldData.length !== newData.length) return false;
    return oldData.every((item, index) => {
      const newItem = newData[index];
      return item.hour === newItem.hour && 
             item.count === newItem.count && 
             item.contact === newItem.contact && 
             item.lost === newItem.lost;
    });
  };

  const handleSearch = async () => {
    if (!sessionId || !baseDate) {
      alert("会期名と日付を入力してください");
      return;
    }

    setLoading(true);
    try {
      const companyId = user?.companyId || currentCompany?.companyId || "memori.inc";
      
      // デバッグ: APIリクエスト時のcompany_idをログ出力
      console.log('=== Realtime API Request Debug ===');
      console.log('User Company ID:', user?.companyId);
      console.log('Current Company ID:', currentCompany?.companyId);
      console.log('Final Company ID for API:', companyId);
      console.log('Session ID:', sessionId);
      console.log('Base Date:', baseDate);

      const res = await axios.get(
        `${currentCompany?.apiEndpoints.baseUrl}/${currentCompany?.apiEndpoints.getLatestVisitors}`,
        {
          params: {
            company_id: companyId,
            session_id: sessionId,
            base_date: baseDate,
          },
        }
      );

      const visitors = res.data.visitors || [];
      const summary = res.data.summary || { contacted: 0, lost: 0, passed: 0 };

      const total = visitors.length;
      const avgDuration =
        visitors.reduce((sum: number, v: any) => sum + (v.duration || 0), 0) / (total || 1);
      const contactRate =
        (summary.contacted / (summary.contacted + summary.lost + summary.passed || 1)) * 100;

      setSummaryData({
        totalVisitors: total,
        contacted: summary.contacted,
        lost: summary.lost,
        passed: summary.passed,
        contactRate: Math.round(contactRate * 10) / 10,
        averageDuration: Math.round((avgDuration / 60) * 10) / 10,
      });

      const hours = Array.from({ length: 10 }, (_, i) => 9 + i);
      const grouped = hours.map((hour) => {
        const hourStr = hour.toString().padStart(2, "0");
        const label = `${hour}時`;
        const hourVisitors = visitors.filter((v: any) =>
          v.first_seen?.startsWith(`${baseDate}T${hourStr}`)
        );
        const count = hourVisitors.length;
        const contact = hourVisitors.filter((v: any) => v.status === "contacted").length;
        const lost = hourVisitors.filter((v: any) => v.status === "lost").length;

        return { hour: label, count, contact, lost };
      });

      // データが変更された場合のみ更新
      if (!isDataEqual(hourlyData, grouped)) {
        setHourlyData(grouped);
      }
    } catch (error: any) {
      console.error("取得エラー", error);
      if (error.response) {
        // APIからのエラーレスポンス
        if (error.response.status === 401) {
          alert('認証エラーです。ログインし直してください。');
        } else if (error.response.status === 403) {
          alert('アクセス権限がありません。');
        } else if (error.response.status === 404) {
          alert('指定されたデータが見つかりません。');
        } else if (error.response.status >= 500) {
          alert('サーバーエラーが発生しました。しばらく時間をおいてから再試行してください。');
        } else {
          alert(`APIエラー: ${error.response.data?.message || error.response.statusText}`);
        }
      } else if (error.request) {
        // ネットワークエラー
        alert('ネットワークエラーが発生しました。インターネット接続をご確認ください。');
      } else {
        // その他のエラー
        alert(error.message || 'データ取得に失敗しました');
      }
    } finally {
      setLoading(false);
    }
  };

  // 保存処理
  const handleSave = async () => {
    if (!sessionId || !baseDate) {
      alert("会期名と日付を入力してください");
      return;
    }
    // ここでsessionDBにPOSTする（ダミー実装）
    alert(`保存しました！\n会期名: ${sessionId}\n日付: ${baseDate}`);
    // 実際はaxios.post(...) などでAPI連携
  };

  // 計測開始処理
  const handleStartMeasurement = async () => {
    if (!sessionId || !baseDate) {
      alert("会期名と日付を入力してください");
      return;
    }
    try {
      const response = await fetch('http://192.168.0.123:5000/start-measurement', {
        method: 'POST',
      });
      const data = await response.json();
      alert(data.message); // 「命令を受信しました」と表示されればOK
    } catch (error) {
      alert('ラズパイに命令を送信できませんでした');
    }
  };

  // 計測終了処理
  const handleStopMeasurement = () => {
    if (!sessionId || !baseDate) {
      alert("会期名と日付を入力してください");
      return;
    }
    alert('計測終了');
  };

  return (
    <div className="dashboard-container" style={{ position: 'relative' }}>
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
      <div className="dashboard-main">
        <h1 className="page-title">リアルタイムダッシュボード</h1>
        <RealtimeSearchBar
          sessionId={sessionId}
          baseDate={baseDate}
          onSessionChange={setSessionId}
          onDateChange={setBaseDate}
          onSave={handleSave}
          onStartMeasurement={handleStartMeasurement}
          onStopMeasurement={handleStopMeasurement}
        />
        {!loading && (
          <>
            <SummaryCards
              data={{
                total_visitors: summaryData.totalVisitors,
                contact_count: summaryData.contacted,
                lost_count: summaryData.lost,
                pass_count: summaryData.passed,
                contact_rate: summaryData.contactRate,
                avg_stay_time: summaryData.averageDuration,
              }}
            />
            <GraphPanel data={hourlyData} />
          </>
        )}
      </div>
    </div>
  );
};

export default RealtimeDashboard;

