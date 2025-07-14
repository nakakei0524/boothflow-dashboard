import React from "react";
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Legend
} from "recharts";

interface DataPoint {
  hour: string;
  count: number;
  contact: number;
  lost: number;
}

interface Props {
  data: DataPoint[];
}

const GraphPanel: React.FC<Props> = ({ data }) => {
  const hours = Array.from({ length: 10 }, (_, i) => (i + 9).toString());

  const completeData = hours.map((h) => {
    const match = data.find((d) => d.hour === h);
    return {
      hour: `${h}時`,
      count: match ? match.count : 0,
      contact: match ? match.contact : 0,
      lost: match ? match.lost : 0,
    };
  });

  const isAllZero = completeData.every(
    (d) => d.count === 0 && d.contact === 0 && d.lost === 0
  );

  const labelMap: Record<string, string> = {
    count: "来場者数",
    contact: "接触数",
    lost: "機会損失",
  };

  return (
    <div className="bg-white shadow rounded p-6 mt-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        時間帯別サマリーデータ
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={completeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis
            allowDecimals={false}
            label={{ value: "人", angle: -90, position: "insideLeft" }}
            domain={[0, (dataMax: number) => (dataMax === 0 ? 1 : Math.ceil(dataMax * 1.2))]}
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              const label = labelMap[name] || name;
              return [`${value} 人`, label];
            }}
          />
          <Legend />
          <Bar dataKey="count" fill="#3182ce" name="来場者数">
            <LabelList
              dataKey="count"
              position="top"
              formatter={(val) =>
                typeof val === "number" && val > 0 ? `${val}人` : ""
              }
            />
          </Bar>
          <Line
            type="monotone"
            dataKey="contact"
            stroke="#f97316"
            strokeWidth={2}
            name="接触数"
            strokeDasharray="3 3"
            dot={{ r: 3 }}
            hide={isAllZero}
          />
          <Line
            type="monotone"
            dataKey="lost"
            stroke="#e11d48"
            strokeWidth={2}
            name="機会損失"
            strokeDasharray="5 3"
            dot={{ r: 3 }}
            hide={isAllZero}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraphPanel;
