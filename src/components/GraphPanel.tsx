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
  id?: string; // グラデーションIDの重複を避けるため
}

const GraphPanel: React.FC<Props> = ({ data, id = "default" }) => {
  // データの検証と正規化をメモ化
  const validatedData = useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);
  
  const hours = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => (i + 9).toString());
  }, []);

  const completeData = useMemo(() => {
    return hours.map((h) => {
      const match = validatedData.find((d) => d && d.hour === h);
      return {
        hour: `${h}時`,
        count: match && typeof match.count === 'number' ? match.count : 0,
        contact: match && typeof match.contact === 'number' ? match.contact : 0,
        lost: match && typeof match.lost === 'number' ? match.lost : 0,
      };
    });
  }, [validatedData, hours]);

  const isAllZero = useMemo(() => {
    return completeData.every(
      (d) => d.count === 0 && d.contact === 0 && d.lost === 0
    );
  }, [completeData]);

  const labelMap = useMemo(() => ({
    count: "来場者数",
    contact: "接触数",
    lost: "機会損失",
  }), []);

  const tooltipFormatter = useCallback((value: number, name: string) => {
    const label = labelMap[name as keyof typeof labelMap] || name;
    return [`${value} 人`, label];
  }, [labelMap]);

  const labelFormatter = useCallback((val: any) => {
    return typeof val === "number" && val > 0 ? `${val}人` : "";
  }, []);

  return (
    <div className="graph-wrapper">
      <h2 className="box-title">時間帯別サマリーデータ</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={completeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="hour" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db' }}
            tickLine={{ stroke: '#d1d5db' }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db' }}
            tickLine={{ stroke: '#d1d5db' }}
            label={{ 
              value: "人", 
              angle: -90, 
              position: "insideLeft",
              style: { textAnchor: 'middle', fill: '#6b7280', fontSize: 12 }
            }}
            domain={[0, (dataMax: number) => (dataMax === 0 ? 1 : Math.ceil(dataMax * 1.2))]}
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

export default React.memo(GraphPanel);
