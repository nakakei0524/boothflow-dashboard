// src/components/Home.tsx
import React, { useEffect, useState } from "react";
import "../index.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import MobileNavBar from "./MobileNavBar";
import MobileLayout from "./MobileLayout";

interface NotionNewsItem {
  title: string;
  date: string;
}

const Home: React.FC = () => {
  const [newsList, setNewsList] = useState<NotionNewsItem[]>([]);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 700);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // スマホ専用デザイン
  if (isMobile) {
    return (
      <MobileLayout title="ホーム">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* 発注フォーム案内 */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px #bdbdbd22', marginBottom: 8 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>次回のご利用はこちらから</h2>
            <p style={{ fontSize: 14, marginBottom: 12 }}>
              BoothFlowは月額制ではなく、その都度ご利用いただけるサービスです。次回の展示会対応をご希望の方は、以下より発注フォームへお進みください。
            </p>
            <button
              style={{ width: '100%', background: 'linear-gradient(90deg, #764ba2 0%, #667eea 100%)', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 8, padding: '12px 0', marginTop: 8 }}
              onClick={() => navigate('/plan-option')}
            >
              プラン・オプションを見る
            </button>
          </div>
          {/* マニュアル */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px #bdbdbd22', marginBottom: 8 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>操作マニュアル</h2>
            <p style={{ fontSize: 14, marginBottom: 12 }}>
              BoothFlowの操作にご不明な点がある場合は、以下よりマニュアルをご確認ください。
            </p>
            <a
              href="https://www.notion.so/229c750ed0598094837fd87e2e246f08?source=copy_link"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', width: '100%', background: '#fff', color: '#764ba2', fontWeight: 700, fontSize: 16, border: '1px solid #764ba2', borderRadius: 8, padding: '12px 0', textAlign: 'center', textDecoration: 'none', marginTop: 8 }}
            >
              マニュアルを見る
            </a>
          </div>
          {/* Coming Soon */}
          <div style={{ background: 'linear-gradient(90deg, #764ba2 0%, #667eea 100%)', borderRadius: 12, padding: 20, color: '#fff', textAlign: 'center', marginBottom: 8 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Coming Soon...</h2>
            <p style={{ fontSize: 14 }}>新しい機能を準備中です</p>
          </div>
          {/* お知らせ */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px #bdbdbd22' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Bflowからのお知らせ</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {newsList.length > 0 ? (
                newsList.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: idx !== newsList.length - 1 ? '1px solid #eee' : 'none' }}>
                    <span style={{ fontSize: 14 }}>{item.title}</span>
                    <span style={{ fontSize: 12, color: '#888' }}>{item.date}</span>
                  </li>
                ))
              ) : (
                <li style={{ color: '#888', fontSize: 14 }}>現在お知らせはありません</li>
              )}
            </ul>
          </div>
        </div>
      </MobileLayout>
    );
  }

  // PC用デザイン（従来通り）
  return (
    <div className="dashboard-main">
      <h1 className="page-title">ホーム</h1>
      <div className="home-section-grid">
        <div className="home-section">
          <div className="home-section-content">
            <h2 className="home-title">次回のご利用はこちらから</h2>
            <p className="home-description">
              BoothFlowは月額制ではなく、その都度ご利用いただけるサービスです。
              次回の展示会対応をご希望の方は、以下より発注フォームへお進みください。
            </p>
            <button
              className="manual-button"
              onClick={() => navigate('/plan-option')}
            >
              プラン・オプションを見る
            </button>
          </div>
        </div>
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
      <div className="home-section coming-soon-section">
        <div className="coming-soon-overlay"></div>
        <div className="coming-soon-content">
          <h2>Coming Soon...</h2>
          <p>新しい機能を準備中です</p>
        </div>
      </div>
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
      <MobileNavBar />
    </div>
  );
};

export default Home;
