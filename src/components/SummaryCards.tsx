// src/components/SummaryCards.tsx
import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import "../index.css"; // CSSも読み込んでおく
import { useCompany } from "../contexts/CompanyContext";
import { useAuth } from "../contexts/AuthContext";

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

interface Card {
  label: string;
  value: string | number;
  unit: string;
  tooltip: string;
  comingSoon?: boolean;
  key: string;
}

// Tooltipコンポーネント
const Tooltip: React.FC<{ text: string; anchorRef: React.RefObject<HTMLSpanElement | null> }> = ({ text, anchorRef }) => {
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  React.useLayoutEffect(() => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({
        top: rect.top + window.scrollY - 44, // 上に44pxずらす
        left: rect.left + window.scrollX,
      });
    }
  }, [anchorRef.current]);
  return createPortal(
    <div className="tooltip-text-portal" style={{ position: 'absolute', top: pos.top, left: pos.left, zIndex: 9999 }}>
      {text}
    </div>,
    document.body
  );
};

const SummaryCards: React.FC<Props> = ({ data }) => {
  const { currentCompany } = useCompany();
  const { user } = useAuth();
  // ユーザーのプランを判定（仮実装：companyIdに基づく）
  const getUserPlan = () => {
    if (user?.companyId === 'memori.inc') {
      return 'basicPlan';
    } else if (user?.companyId === 'enterprise') {
      return 'enterprisePlan';
    } else {
      return 'lightPlan';
    }
  };
  const userPlan = getUserPlan();
  const planFeatures = currentCompany?.planFeatures?.[userPlan as keyof typeof currentCompany.planFeatures] || currentCompany?.planFeatures?.lightPlan;

  const cards: Card[] = [
    {
      label: "来場者数",
      value: data.total_visitors,
      unit: "人",
      tooltip: "2分以上ブースに滞在した来場者の人数を示します",
      key: "total_visitors",
    },
    {
      label: "接触者数",
      value: planFeatures?.contactRate ? data.contact_count : "-",
      unit: "人",
      tooltip: planFeatures?.contactRate ? "スタッフが対応（話しかけ）した来場者数です" : "このプランでは使えません",
      key: "contact_count",
      comingSoon: !planFeatures?.contactRate,
    },
    {
      label: "機会損失数",
      value: planFeatures?.opportunityLoss ? data.lost_count : "-",
      unit: "人",
      tooltip: planFeatures?.opportunityLoss ? "30秒以上注目されたが話しかけられなかった人数です" : "このプランでは使えません",
      key: "lost_count",
      comingSoon: !planFeatures?.opportunityLoss,
    },
    {
      label: "接触率",
      value: planFeatures?.contactRate ? `${(data.contact_rate * 100).toFixed(1)}` : "-",
      unit: "%",
      tooltip: planFeatures?.contactRate ? "来場者のうち接触（話しかけ）できた割合です" : "このプランでは使えません",
      key: "contact_rate",
      comingSoon: !planFeatures?.contactRate,
    },
    {
      label: "通過人数",
      value: data.pass_count,
      unit: "人",
      tooltip: "ブース前を通過したが立ち止まらなかった人数です",
      key: "pass_count",
    },
    {
      label: "平均滞在時間",
      value: data.avg_stay_time.toFixed(1),
      unit: "分",
      tooltip: "来場者の平均ブース滞在時間（分単位）です",
      key: "avg_stay_time",
    },
  ];

  // カミングスーン用ダミーカードを追加
  const comingSoonCards: Card[] = Array.from({ length: 4 }, (_, i) => ({
    label: "Coming Soon",
    value: "-",
    unit: "",
    tooltip: "新機能を準備中です",
    comingSoon: true,
    key: `coming-soon-${i}`,
  }));

  const allCards: Card[] = [...cards, ...comingSoonCards];

  // ツールチップの表示状態と参照を一元管理
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const tipRefs = useRef<(HTMLSpanElement | null)[]>([]);

  return (
    <div className="summary-cards-wrapper">
      <div className="summary-cards-grid">
        {allCards.map((card, idx) => (
          <div key={card.key || idx} className={`summary-card${card.comingSoon ? " coming-soon-card" : ""}`} style={card.comingSoon ? { opacity: 0.5, background: '#eee', color: '#888' } : {}}>
            <div className="summary-label">
              <span
                className="tooltip-icon"
                ref={el => { tipRefs.current[idx] = el; }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onFocus={() => setHoveredIdx(idx)}
                onBlur={() => setHoveredIdx(null)}
                tabIndex={0}
              >
              {card.label}
                <span className="tooltip-mark">？</span>
                {hoveredIdx === idx && (
                  <Tooltip text={card.tooltip} anchorRef={{ current: tipRefs.current[idx] }} />
                )}
              </span>
            </div>
            <div className="summary-value">
              {card.value} <span className="summary-unit">{card.unit}</span>
            </div>
            {card.comingSoon && (
              <div className="coming-soon-badge">このプランでは使えません</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryCards;
