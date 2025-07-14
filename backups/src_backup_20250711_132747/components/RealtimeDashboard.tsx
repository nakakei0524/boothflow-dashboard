// src/components/RealtimeDashboard.tsx
import React, { useState } from "react";
import SummaryCards from "./SummaryCards";
import GraphPanel from "./GraphPanel";
import RealtimeSearchBar from "./RealtimeSearchBar";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const RealtimeDashboard: React.FC = () => {
  const { user } = useAuth();
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

  const handleSearch = async () => {
    if (!sessionId || !baseDate) {
      alert("会期名と日付を入力してください");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        "https://tnabm11fyh.execute-api.ap-northeast-1.amazonaws.com/dev/getLatestVisitors",
        {
          params: {
            company_id: user?.companyId || "memori.inc",
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

      setHourlyData(grouped);
    } catch (error) {
      console.error("取得エラー", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-main">
        <RealtimeSearchBar
          sessionId={sessionId}
          baseDate={baseDate}
          onSessionChange={setSessionId}
          onDateChange={setBaseDate}
          onSearch={handleSearch}
        />

        {loading && <p>読み込み中...</p>}

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
            <div className="graph-wrapper">
              <GraphPanel data={hourlyData} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RealtimeDashboard;
