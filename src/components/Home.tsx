// src/components/Home.tsx
import React, { useEffect, useState } from "react";
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
      <div className="dashboard-main">
      <h1 className="page-title">ホーム</h1>
        {/* マニュアル & 発注フォームを別セクションで横並びに表示（発注を右側に） */}
      <div className="home-section-grid">
          {/* 発注フォーム案内セクション */}
        <div className="home-section">
          <div className="home-section-content">
            <h2 className="home-title">次回のご利用はこちらから</h2>
            <p className="home-description">
              BoothFlowは月額制ではなく、その都度ご利用いただけるサービスです。
              次回の展示会対応をご希望の方は、以下より発注フォームへお進みください。
            </p>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSfSBlPnYSh6PdgVOhtbKK3ALfBXCVwzpmyASJkgCq4hfioUuA/viewform?usp=dialog"
                target="_blank"
                rel="noopener noreferrer"
                className="manual-button"
              >
                発注フォームはこちら
              </a>
            </div>
          </div>

          {/* マニュアルセクション */}
        <div className="home-section">
          <div className="home-section-content">
            <h2 className="home-title">操作マニュアル</h2>
            <p className="home-description">
              BoothFlowの操作にご不明な点がある場合は、以下よりマニュアルをご確認ください。
            </p>
              <a
                href="https://www.notion.so/229c750ed0598094837fd87e2e246f08?source=copy_link"
                target="_blank"
                rel="noopener noreferrer"
              className="manual-button manual-button-secondary"
              >
                マニュアルを見る
              </a>
            </div>
          </div>
        </div>

        {/* Coming Soon セクション */}
     <div className="home-section coming-soon-section">
  <div className="coming-soon-overlay"></div>
  <div className="coming-soon-content">
    <h2>Coming Soon...</h2>
    <p>新しい機能を準備中です</p>
          </div>
        </div>

      {/* お知らせセクション */}
        <div className="home-section">
          <h2 className="home-subtitle">Bflowからのお知らせ</h2>
          <ul className="home-list">
            {newsList.length > 0 ? (
              newsList.map((item, idx) => (
              <li key={idx}>
                <span className="news-title">{item.title}</span>
                <span className="news-date">{item.date}</span>
              </li>
              ))
            ) : (
            <li className="no-news">現在お知らせはありません</li>
            )}
          </ul>
      </div>
    </div>
  );
};

export default Home;
