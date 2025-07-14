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
  Legend,
  LabelList
} from "recharts";

interface DataPoint {
  hour: string;
  count: number;
  contact: number;
  lost: number;
}

interface Props {
  data: DataPoint[];
  title: string;
}

const LatestGraphPanel: React.FC<Props> = ({ data, title }) => {
  const labelMap: Record<string, string> = {
    count: "来場者数",
    contact: "接触数",
    lost: "機会損失",
  };

  const filledData = (data.length === 0
    ? Array.from({ length: 10 }, (_, i) => ({
        hour: (i + 9).toString(),
        count: 0,
        contact: 0,
        lost: 0,
      }))
    : data
  ).map((d) => ({
    ...d,
    label: `${d.hour}時`
  }));

  const isAllZero = filledData.every(
    (d) => d.count === 0 && d.contact === 0 && d.lost === 0
  );

  return (
    <div className="home-section">
      <h2 className="home-subtitle">
        直近の展示会サマリ <span style={{ fontSize: "16px", fontWeight: "normal" }}>{title}</span>
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={filledData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis
            allowDecimals={false}
            domain={[0, (dataMax: number) => (dataMax === 0 ? 1 : Math.ceil(dataMax * 1.2))]}
            label={{ value: "人", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              const label = labelMap[name] || name;
              return [`${value} 人`, label];
            }}
          />
          <Legend />
          <Bar dataKey="count" fill="#3399ff" name="来場者数">
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

export default LatestGraphPanel;
