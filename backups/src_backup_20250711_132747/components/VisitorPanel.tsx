import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  sessionId: string;
  date: string;
}

interface Visitor {
  track_id: string;
  first_seen: string;
  last_seen: string;
  duration: number;
  status: string;
  has_contacted: boolean;
}

interface Summary {
  contacted: number;
  lost: number;
  passed: number;
}

const VisitorPanel: React.FC<Props> = ({ sessionId, date }) => {
  const { user } = useAuth();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [summary, setSummary] = useState<Summary>({ contacted: 0, lost: 0, passed: 0 });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://tnabm11fyh.execute-api.ap-northeast-1.amazonaws.com/dev/getLatestVisitors", {
        params: {
          company_id: user?.companyId || "memori.inc",
          session_id: sessionId,
          base_date: date,
        },
      });
      setVisitors(res.data.visitors || []);
      setSummary(res.data.summary || { contacted: 0, lost: 0, passed: 0 });
    } catch (err) {
      console.error("来場者取得エラー", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 180000); // 3分ごと
    return () => clearInterval(interval);
  }, [sessionId, date]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">来場者データ</h3>
        <button
          onClick={fetchData}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          更新
        </button>
      </div>

      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <>
          <div className="flex gap-4 mb-4">
            <div>🟢 接触：{summary.contacted}人</div>
            <div>🔴 機会損失：{summary.lost}人</div>
            <div>⚪ 通過：{summary.passed}人</div>
          </div>

          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">first_seen</th>
                <th className="p-2 border">last_seen</th>
                <th className="p-2 border">滞在秒数</th>
                <th className="p-2 border">ステータス</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map((v) => (
                <tr key={v.track_id}>
                  <td className="p-2 border">{v.track_id}</td>
                  <td className="p-2 border">{v.first_seen}</td>
                  <td className="p-2 border">{v.last_seen}</td>
                  <td className="p-2 border">{v.duration}</td>
                  <td className="p-2 border">{v.status}</td>
                </tr>
              ))}
              {visitors.length === 0 && (
                <tr>
                  <td className="p-2 border text-center" colSpan={5}>データがありません</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default VisitorPanel;
