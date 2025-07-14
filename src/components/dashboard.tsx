// ✅ ファイル名：src/components/dashboard.tsx
import React, { useState } from "react";
import axios from "axios";
import Header from "./Header";
import VisitorList from "./VisitorList";
import GraphPanel from "./GraphPanel";
import Sidebar from "./Sidebar";
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
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ marginLeft: "200px", padding: "20px", flex: 1 }}>
        <Header onSearch={fetchStats} />

        <main className="main-content">
          {loading && <p className="text-center">読み込み中...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {stats && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <VisitorList stats={stats} />
            </div>
          )}

          {hourlyData.length > 0 && (
            <div className="grid grid-cols-1">
              <GraphPanel data={hourlyData} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
