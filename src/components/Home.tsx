// src/components/Home.tsx
import React, { useEffect, useState } from "react";
import "../index.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import MobileNavBar from "./MobileNavBar";
import MobileLayout from "./MobileLayout";
import { useCompany } from "../contexts/CompanyContext";

interface NotionNewsItem {
  id: string;
  title: string;
  date: string;
  description: string;
  url: string;
  status: string;
}

const Home: React.FC = () => {
  const [newsList, setNewsList] = useState<NotionNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const { currentCompany } = useCompany();
  const companyId = currentCompany?.companyId;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 700);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Netlify Functionsを使用してNotion APIを呼び出し
        console.log("Fetching news from Netlify Functions...");
        const response = await fetch('/.netlify/functions/get-notion-news');
        
        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("HTTP Error:", response.status, errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error("Invalid content type:", contentType);
          console.error("Response text:", text);
          throw new Error("Invalid response format");
        }

        const data = await response.json();
        console.log("Notion API response:", data);

        if (data.success) {
          setNewsList(data.data);
          console.log("News fetched successfully:", data.data);
        } else {
          console.error("お知らせの取得に失敗しました", data.error);
          setError("お知らせの取得に失敗しました");
        }
      } catch (err) {
        console.error("お知らせの取得に失敗しました", err);
        setError("お知らせの取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  // 日付をフォーマットする関数
  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "不明") return "不明";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // ニュースセクションのレンダリング
  const renderNewsSection = () => {
    if (isLoading) {
      return (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          <div style={{ fontSize: '14px' }}>お知らせを読み込み中...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ textAlign: 'center', padding: '20px', color: '#ff6b6b' }}>
          <div style={{ fontSize: '14px' }}>{error}</div>
        </div>
      );
    }

    if (newsList.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
          <div style={{ fontSize: '14px' }}>現在お知らせはありません</div>
        </div>
      );
    }

    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {newsList.map((item, idx) => (
          <li key={item.id} style={{ 
            padding: '12px 0', 
            borderBottom: idx !== newsList.length - 1 ? '1px solid #eee' : 'none',
            transition: 'background-color 0.2s'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <span style={{ 
                fontSize: '14px', 
                fontWeight: 600, 
                flex: 1,
                color: '#333',
                lineHeight: '1.4'
              }}>
                {item.title}
              </span>
              <span style={{ 
                fontSize: '12px', 
                color: '#888', 
                marginLeft: 12,
                whiteSpace: 'nowrap'
              }}>
                {formatDate(item.date)}
              </span>
            </div>
            {item.description && (
              <p style={{ 
                fontSize: '13px', 
                color: '#666', 
                margin: '6px 0 0 0', 
                lineHeight: '1.5',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {item.description}
              </p>
            )}
            {item.url && (
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  fontSize: '12px', 
                  color: '#764ba2', 
                  textDecoration: 'none', 
                  display: 'inline-block', 
                  marginTop: 8,
                  fontWeight: 500
                }}
              >
                詳細を見る →
              </a>
            )}
          </li>
        ))}
      </ul>
    );
  };

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
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Bflowからのお知らせ</h2>
            {renderNewsSection()}
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
          <div className="news-container">
            {renderNewsSection()}
          </div>
        </div>
      <MobileNavBar />
    </div>
  );
};

export default Home;
