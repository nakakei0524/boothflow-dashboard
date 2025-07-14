// src/components/RealtimeSearchBar.tsx
import React from "react";

interface Props {
  sessionId: string;
  baseDate: string;
  onSessionChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onSearch: () => void;
}

const RealtimeSearchBar: React.FC<Props> = ({
  sessionId,
  baseDate,
  onSessionChange,
  onDateChange,
  onSearch,
}) => {
  return (
    <div className="header-container">
      <div className="search-bar compact">
        <label>会期名：</label>
        <input
          type="text"
          placeholder="キーワード"
          className="search-input"
          value={sessionId}
          onChange={(e) => onSessionChange(e.target.value)}
        />
        <label>日付：</label>
        <input
          type="date"
          className="date-input"
          value={baseDate}
          onChange={(e) => onDateChange(e.target.value)}
        />
        <button className="search-button" onClick={onSearch}>
          検索
        </button>
      </div>
    </div>
  );
};

export default RealtimeSearchBar;
