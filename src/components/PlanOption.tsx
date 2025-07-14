import React from "react";
import Sidebar from "./Sidebar";
import "../index.css";

const PlanOption: React.FC = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <h1 className="page-title">プラン・オプション</h1>
        
        <div className="plan-options-container">
          {/* 現在のプラン情報 */}
          <div className="current-plan-section">
            <h2 className="section-title">現在のプラン</h2>
            <div className="current-plan-card">
              <div className="plan-header">
                <h3 className="plan-name">ベーシックプラン</h3>
                <span className="plan-status active">アクティブ</span>
              </div>
              <div className="plan-details">
                <p className="plan-description">
                  基本的な機能を含むスタンダードプランです。
                </p>
                <div className="plan-features">
                  <div className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>リアルタイムダッシュボード</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>過去データ検索</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>基本レポート機能</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 利用可能なプラン */}
          <div className="available-plans-section">
            <h2 className="section-title">利用可能なプラン</h2>
            <div className="plans-grid">
              {/* ベーシックプラン */}
              <div className="plan-card">
                <div className="plan-header">
                  <h3 className="plan-name">ベーシックプラン</h3>
                  <div className="plan-price">
                    <span className="price-amount">¥50,000</span>
                    <span className="price-period">/月</span>
                  </div>
                </div>
                <div className="plan-description">
                  小規模な展示会に最適な基本プラン
                </div>
                <div className="plan-features">
                  <div className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>リアルタイムダッシュボード</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>過去データ検索</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>基本レポート機能</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>最大1000人来場者対応</span>
                  </div>
                </div>
                <button className="plan-button current">
                  現在のプラン
                </button>
              </div>

              {/* スタンダードプラン */}
              <div className="plan-card featured">
                <div className="plan-badge">人気</div>
                <div className="plan-header">
                  <h3 className="plan-name">スタンダードプラン</h3>
                  <div className="plan-price">
                    <span className="price-amount">¥100,000</span>
                    <span className="price-period">/月</span>
                  </div>
                </div>
                <div className="plan-description">
                  中規模展示会に最適なスタンダードプラン
                </div>
                <div className="plan-features">
                  <div className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>ベーシックプランの全機能</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>カスタムレポート</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>データエクスポート機能</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>最大5000人来場者対応</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>優先サポート</span>
                  </div>
                </div>
                <button className="plan-button upgrade">
                  アップグレード
                </button>
              </div>

              {/* プレミアムプラン */}
              <div className="plan-card">
                <div className="plan-header">
                  <h3 className="plan-name">プレミアムプラン</h3>
                  <div className="plan-price">
                    <span className="price-amount">¥200,000</span>
                    <span className="price-period">/月</span>
                  </div>
                </div>
                <div className="plan-description">
                  大規模展示会に最適なプレミアムプラン
                </div>
                <div className="plan-features">
                  <div className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>スタンダードプランの全機能</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>高度な分析機能</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>API連携</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>無制限来場者対応</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>専任サポート</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>カスタム開発対応</span>
                  </div>
                </div>
                <button className="plan-button upgrade">
                  アップグレード
                </button>
              </div>
            </div>
          </div>

          {/* オプション機能 */}
          <div className="options-section">
            <h2 className="section-title">オプション機能</h2>
            <div className="options-grid">
              <div className="option-card">
                <div className="option-header">
                  <h3 className="option-name">データバックアップ</h3>
                  <span className="option-price">¥10,000/月</span>
                </div>
                <p className="option-description">
                  重要なデータを安全にバックアップし、復元機能を提供します。
                </p>
                <button className="option-button">
                  追加する
                </button>
              </div>

              <div className="option-card">
                <div className="option-header">
                  <h3 className="option-name">高度な分析ツール</h3>
                  <span className="option-price">¥20,000/月</span>
                </div>
                <p className="option-description">
                  AIを活用した高度な分析と予測機能を提供します。
                </p>
                <button className="option-button">
                  追加する
                </button>
              </div>

              <div className="option-card">
                <div className="option-header">
                  <h3 className="option-name">カスタム統合</h3>
                  <span className="option-price">¥50,000/月</span>
                </div>
                <p className="option-description">
                  既存システムとのカスタム統合をサポートします。
                </p>
                <button className="option-button">
                  追加する
                </button>
              </div>
            </div>
          </div>

          {/* お問い合わせセクション */}
          <div className="contact-section">
            <h2 className="section-title">お問い合わせ</h2>
            <div className="contact-card">
              <p className="contact-description">
                プランの変更やオプション機能の追加についてご質問がございましたら、
                お気軽にお問い合わせください。
              </p>
              <div className="contact-buttons">
                <button className="contact-button primary">
                  お問い合わせ
                </button>
                <button className="contact-button secondary">
                  資料請求
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanOption; 