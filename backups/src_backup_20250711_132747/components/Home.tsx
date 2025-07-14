// src/components/Home.tsx
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "../index.css";
import axios from "axios";

interface NotionNewsItem {
  title: string;
  date: string;
}

const Home: React.FC = () => {
  const [newsList, setNewsList] = useState<NotionNewsItem[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("https://your-api-endpoint.com/get-notion-news");
        setNewsList(response.data);
      } catch (err) {
        console.error("お知らせの取得に失敗しました", err);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        {/* マニュアル & 発注フォームを別セクションで横並びに表示（発注を右側に） */}
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          {/* 発注フォーム案内セクション */}
          <div className="home-section" style={{ flex: "1", minWidth: "300px" }}>
            <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
              <h2 style={{ fontSize: "20px", marginBottom: "12px" }}>次回のご利用はこちらから</h2>
              <p style={{ marginBottom: "16px" }}>BoothFlowは月額制ではなく、その都度ご利用いただけるサービスです。次回の展示会対応をご希望の方は、以下より発注フォームへお進みください。</p>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSfSBlPnYSh6PdgVOhtbKK3ALfBXCVwzpmyASJkgCq4hfioUuA/viewform?usp=dialog"
                target="_blank"
                rel="noopener noreferrer"
                className="manual-button"
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  display: "inline-block",
                  textAlign: "center",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  textDecoration: "none"
                }}
              >
                発注フォームはこちら
              </a>
            </div>
          </div>

          {/* マニュアルセクション */}
          <div className="home-section" style={{ flex: "1", minWidth: "300px" }}>
            <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
              <h2 style={{ fontSize: "20px", marginBottom: "12px" }}>操作マニュアル</h2>
              <p style={{ marginBottom: "16px" }}>BoothFlowの操作にご不明な点がある場合は、以下よりマニュアルをご確認ください。</p>
              <a
                href="https://www.notion.so/229c750ed0598094837fd87e2e246f08?source=copy_link"
                target="_blank"
                rel="noopener noreferrer"
                className="manual-button"
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  display: "inline-block",
                  textAlign: "center",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  textDecoration: "none"
                }}
              >
                マニュアルを見る
              </a>
            </div>
          </div>
        </div>

        {/* Coming Soon セクション */}
        <div className="home-section" style={{ position: "relative" }}>
          <div style={{ height: "240px", background: "#f0f0f0", borderRadius: "12px", filter: "blur(6px)" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "rgba(255,255,255,0.8)", padding: "12px 24px", borderRadius: "8px", fontSize: "18px", fontWeight: "bold" }}>
            Coming Soon...
          </div>
        </div>

        <div className="home-section">
          <h2 className="home-subtitle">Bflowからのお知らせ</h2>
          <ul className="home-list">
            {newsList.length > 0 ? (
              newsList.map((item, idx) => (
                <li key={idx}>{item.title} <span>{item.date}</span></li>
              ))
            ) : (
              <li>現在お知らせはありません</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
