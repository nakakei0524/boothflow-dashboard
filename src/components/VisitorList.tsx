// ✅ ファイル名：src/components/VisitorList.tsx
import React from "react";

interface Props {
  stats: {
    total_visitors: number;
    contacted_count: number;
    lost_opportunities: number;
    passed_count: number;
    stayed_count: number;
    contact_rate: number;
    average_duration: number;
  };
}

const VisitorList: React.FC<Props> = ({ stats }) => {
  const rows = [
    { label: "来場者数", value: stats.total_visitors },
    { label: "接触数", value: stats.contacted_count },
    { label: "機会損失", value: stats.lost_opportunities },
    { label: "通過人数", value: stats.passed_count },
    { label: "滞在人数", value: stats.stayed_count },
    { label: "接触率", value: `${(stats.contact_rate * 100).toFixed(1)}%` },
    { label: "平均滞在時間", value: `${stats.average_duration} 秒` },
  ];

  return (
    <div className="bg-white shadow rounded p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">来場データサマリー</h2>
      <ul className="space-y-2">
        {rows.map((row, idx) => (
          <li key={idx} className="flex justify-between text-sm border-b pb-1">
            <span className="text-gray-600">{row.label}</span>
            <span className="font-medium text-gray-800">{row.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VisitorList;
