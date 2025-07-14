// src/components/SearchDashboard.tsx
import React, { useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Header from "./Header";
import SummaryCards from "./SummaryCards";
import GraphPanel from "./GraphPanel";
import { useAuth } from "../contexts/AuthContext";
import "../index.css";

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

const SearchDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>(dummyStats);
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async (
    _sessionKeyword: string,
    startDate: string,
    endDate: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const companyId = user?.companyId || "memori.inc";

      const statsRes = await axios.get(
        "https://tnabm11fyh.execute-api.ap-northeast-1.amazonaws.com/dev/getDashboardData",
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
        "https://tnabm11fyh.execute-api.ap-northeast-1.amazonaws.com/dev/getHourlyVisitors",
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
      setError(err.message || "データ取得に失敗しました");
      setStats(dummyStats);
      setHourlyData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <Header onSearch={fetchStats} />

        {loading && <p className="status-message">読み込み中...</p>}
        {error && <p className="status-message error">{error}</p>}

        <div className="card-grid">
          <SummaryCards
            data={{
              total_visitors: stats.total_visitors,
              contact_count: stats.contacted_count,
              lost_count: stats.lost_opportunities,
              pass_count: stats.passed_count,
              contact_rate: stats.contact_rate,
              avg_stay_time: stats.average_duration / 60,
            }}
          />
        </div>

        <div className="box-section">
          <GraphPanel data={hourlyData} />
        </div>
      </div>
    </div>
  );
};

export default SearchDashboard;
