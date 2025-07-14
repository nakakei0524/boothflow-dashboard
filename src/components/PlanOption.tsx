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
          {/* 利用可能なプラン */}
          <div className="available-plans-section">
            <h2 className="section-title">利用可能なプラン</h2>
            <div className="plans-grid">
              {/* ライトプラン */}
              <div className="plan-card">
                <div className="plan-header">
                  <h3 className="plan-name">ライトプラン</h3>
                  <div className="plan-price">
                    <span className="price-amount">¥30,000</span>
                    <span className="price-period">/回（税別）</span>
                  </div>
                </div>
                <div className="plan-features">
                  <div className="feature-item">来場者カウント</div>
                  <div className="feature-item">スタッフ判定除外</div>
                  <div className="feature-item">時間帯別グラフ表示</div>
                  <div className="feature-item">平均滞在時間の可視化</div>
                </div>
              </div>
              {/* ベーシックプラン */}
              <div className="plan-card featured">
                <div className="plan-badge">おすすめ</div>
                <div className="plan-header">
                  <h3 className="plan-name">ベーシックプラン</h3>
                  <div className="plan-price">
                    <span className="price-amount">¥60,000</span>
                    <span className="price-period">（税別）</span>
                  </div>
                </div>
                <div className="plan-features">
                  <div className="feature-item">ライトプランの全機能</div>
                  <div className="feature-item">リアルタイムダッシュボード</div>
                  <div className="feature-item">機会損失判定</div>
                  <div className="feature-item">接触率算出</div>
                  <div className="feature-item">機会損失率グラフ</div>
                </div>
              </div>
            </div>
          </div>

          {/* オプション機能 */}
          <div className="options-section">
            <h2 className="section-title">オプション</h2>
            <div className="options-grid">
              <div className="option-card">
                <div className="option-header">
                  <h3 className="option-name">設置作業サポート（設営撤去込み）</h3>
                  <span className="option-price">¥20,000</span>
                </div>
              </div>
              <div className="option-card">
                <div className="option-header">
                  <h3 className="option-name">Slack通知連携</h3>
                  <span className="option-price">¥10,000</span>
                </div>
              </div>
              <div className="option-card">
                <div className="option-header">
                  <h3 className="option-name">全会期データ抽出プラン</h3>
                  <span className="option-price">月額 ¥20,000</span>
                </div>
                <p className="option-description">過去の展示会（前回分含む）のデータアクセス・抽出が可能</p>
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