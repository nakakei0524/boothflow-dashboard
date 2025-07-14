// src/components/SummaryCards.tsx
import React from "react";
import "../index.css"; // CSSも読み込んでおく

interface Props {
  data: {
    total_visitors: number;
    contact_count: number;
    lost_count: number;
    pass_count: number;
    contact_rate: number;
    avg_stay_time: number;
  };
}

const SummaryCards: React.FC<Props> = ({ data }) => {
  const cards = [
    {
      label: "来場者数",
      value: data.total_visitors,
      unit: "人",
      tooltip: "2分以上ブースに滞在した来場者の人数を示します",
    },
    {
      label: "接触者数",
      value: data.contact_count,
      unit: "人",
      tooltip: "スタッフが対応（話しかけ）した来場者数です",
    },
    {
      label: "機会損失数",
      value: data.lost_count,
      unit: "人",
      tooltip: "30秒以上注目されたが話しかけられなかった人数です",
    },
    {
      label: "接触率",
      value: `${(data.contact_rate * 100).toFixed(1)}`,
      unit: "%",
      tooltip: "来場者のうち接触（話しかけ）できた割合です",
    },
    {
      label: "通過人数",
      value: data.pass_count,
      unit: "人",
      tooltip: "ブース前を通過したが立ち止まらなかった人数です",
    },
    {
      label: "平均滞在時間",
      value: data.avg_stay_time.toFixed(1),
      unit: "分",
      tooltip: "来場者の平均ブース滞在時間（分単位）です",
    },
  ];

  return (
    <div className="summary-cards-wrapper">
      <div className="summary-cards-grid">
        {cards.map((card, idx) => (
          <div key={idx} className="summary-card">
            <div className="summary-label">
              {card.label}
              <span className="tooltip-icon">？
                <span className="tooltip-text">{card.tooltip}</span>
              </span>
            </div>
            <div className="summary-value">
              {card.value} <span className="summary-unit">{card.unit}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="summary-dl-button">
        <button className="dl-button">
          ダウンロード <span style={{ fontSize: "18px" }}>⬇</span>
        </button>
      </div>
    </div>
  );
};

export default SummaryCards;
