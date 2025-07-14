import React from "react";
import "./StatCard.css";

interface StatCardProps {
  title: string;
  value: string;
  unit?: string;
  tooltip?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, unit, tooltip }) => {
  return (
    <div className="stat-card">
      <div className="stat-title">
        {title}
        {tooltip && (
          <span className="tooltip-icon">？
            <span className="tooltip-text">{tooltip}</span>
          </span>
        )}
      </div>
      <div className="stat-value">
        {value}
        {unit && <span className="stat-unit">{unit}</span>}
      </div>
    </div>
  );
};

export default StatCard;
