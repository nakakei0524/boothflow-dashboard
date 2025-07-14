// src/components/Header.tsx
import React, { useState } from "react";
import "../index.css";

interface HeaderProps {
  onSearch: (keyword: string, startDate: string, endDate: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [keyword, setKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearch = () => {
    onSearch(keyword, startDate, endDate);
  };

  return (
    <div className="header-container">
      <div className="search-bar compact">
        <label>会期名：</label>
        <input
          type="text"
          placeholder="キーワード"
          className="search-input"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <label>日付：</label>
        <input
          type="date"
          className="date-input"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <span className="tilde">〜</span>
        <input
          type="date"
          className="date-input"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          検索
        </button>
      </div>
    </div>
  );
};

export default Header;
