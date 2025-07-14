import React, { useMemo, useCallback } from "react";
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
  id?: string; // グラデーションIDの重複を避けるため
}

const LatestGraphPanel: React.FC<Props> = ({ data, title, id = "latest" }) => {
  const labelMap = useMemo(() => ({
    count: "来場者数",
    contact: "接触数",
    lost: "機会損失",
  }), []);

  // データの検証と正規化をメモ化
  const validatedData = useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);

  const filledData = useMemo(() => {
    return (validatedData.length === 0
      ? Array.from({ length: 10 }, (_, i) => ({
          hour: (i + 9).toString(),
          count: 0,
          contact: 0,
          lost: 0,
        }))
      : validatedData
    ).map((d) => ({
      hour: d.hour || '',
      count: typeof d.count === 'number' ? d.count : 0,
      contact: typeof d.contact === 'number' ? d.contact : 0,
      lost: typeof d.lost === 'number' ? d.lost : 0,
      label: `${d.hour || ''}時`
    }));
  }, [validatedData]);

  const isAllZero = useMemo(() => {
    return filledData.every(
      (d) => d.count === 0 && d.contact === 0 && d.lost === 0
    );
  }, [filledData]);

  const tooltipFormatter = useCallback((value: number, name: string) => {
    const label = labelMap[name as keyof typeof labelMap] || name;
    return [`${value} 人`, label];
  }, [labelMap]);

  const labelFormatter = useCallback((val: any) => {
    return typeof val === "number" && val > 0 ? `${val}人` : "";
  }, []);

  return (
    <div className="graph-wrapper">
      <h2 className="box-title">
        直近の展示会サマリ <span style={{ fontSize: "16px", fontWeight: "normal", color: "#6b7280" }}>{title}</span>
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={filledData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="label" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db' }}
            tickLine={{ stroke: '#d1d5db' }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db' }}
            tickLine={{ stroke: '#d1d5db' }}
            domain={[0, (dataMax: number) => (dataMax === 0 ? 1 : Math.ceil(dataMax * 1.2))]}
            label={{ 
              value: "人", 
              angle: -90, 
              position: "insideLeft",
              style: { textAnchor: 'middle', fill: '#6b7280', fontSize: 12 }
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
            formatter={tooltipFormatter}
            labelStyle={{ color: '#374151', fontWeight: '600' }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '10px' }}
            iconType="circle"
          />
          <Bar 
            dataKey="count" 
            fill={`url(#barGradient-${id})`}
            name="来場者数"
            radius={[4, 4, 0, 0]}
          >
            <LabelList
              dataKey="count"
              position="top"
              formatter={labelFormatter}
              style={{ fontSize: 11, fill: '#374151' }}
            />
          </Bar>
          <Line
            type="monotone"
            dataKey="contact"
            stroke={`url(#contactGradient-${id})`}
            strokeWidth={3}
            name="接触数"
            strokeDasharray="5 5"
            dot={{ 
              r: 4, 
              fill: '#f97316',
              stroke: 'white',
              strokeWidth: 2
            }}
            activeDot={{ r: 6, stroke: '#f97316', strokeWidth: 2 }}
            hide={isAllZero}
          />
          <Line
            type="monotone"
            dataKey="lost"
            stroke={`url(#lostGradient-${id})`}
            strokeWidth={3}
            name="機会損失"
            strokeDasharray="8 4"
            dot={{ 
              r: 4, 
              fill: '#e11d48',
              stroke: 'white',
              strokeWidth: 2
            }}
            activeDot={{ r: 6, stroke: '#e11d48', strokeWidth: 2 }}
            hide={isAllZero}
          />
          
          {/* グラデーション定義 */}
          <defs>
            <linearGradient id={`barGradient-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="100%" stopColor="#764ba2" />
            </linearGradient>
            <linearGradient id={`contactGradient-${id}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <linearGradient id={`lostGradient-${id}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#e11d48" />
              <stop offset="100%" stopColor="#be123c" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(LatestGraphPanel);
