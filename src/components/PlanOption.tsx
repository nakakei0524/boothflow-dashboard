import React, { useEffect, useState } from "react";
import "../index.css";

const PlanOption: React.FC = () => {
  // レスポンシブ判定用state
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const check = () => setIsMobile(window.innerWidth <= 700);
      check();
      window.addEventListener('resize', check);
      return () => window.removeEventListener('resize', check);
    }
  }, []);

  // レスポンシブ用のスタイル
  const styles = {
    root: {
      background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)',
      minHeight: '100vh',
      padding: 0,
    },
    container: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: isMobile ? '32px 4px 0 4px' : '48px 8px 0 8px',
      textAlign: 'center' as const,
    },
    title: {
      fontSize: isMobile ? '2rem' : '2.5rem',
      fontWeight: 700,
      color: '#4f3ca7',
      marginBottom: 12,
      letterSpacing: 1,
    },
    desc: {
      color: '#555',
      marginBottom: 40,
      fontSize: '1.1rem',
      lineHeight: 2,
    },
    planRow: {
      display: 'flex',
      gap: isMobile ? 16 : 32,
      justifyContent: 'center',
      alignItems: 'stretch',
      marginBottom: 48,
      flexWrap: 'wrap' as const,
    },
    planCard: {
      background: '#fff',
      borderRadius: 20,
      boxShadow: '0 6px 32px #bdbdbd22',
      padding: isMobile ? 20 : 36,
      minWidth: isMobile ? 220 : 260, // ←数値で統一
      maxWidth: isMobile ? '98%' : 360, // ←%は文字列、pxは数値
      flex: '1 1 320px',
      margin: '0 8px',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      position: 'relative' as const,
      marginBottom: 24,
    },
    planCardFeatured: {
      border: '2.5px solid #764ba2',
      paddingTop: isMobile ? 48 : 72, // ←数値で統一
    },
    badge: {
      position: 'absolute' as const,
      top: 16,
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#764ba2',
      color: '#fff',
      borderRadius: 14,
      padding: isMobile ? '4px 12px' : '6px 24px',
      fontSize: isMobile ? 13 : 15,
      fontWeight: 600,
      letterSpacing: 1,
      boxShadow: '0 2px 8px #bdbdbd33',
      zIndex: 2,
    },
    planTitle: {
      fontSize: '1.3rem',
      fontWeight: 600,
      color: '#764ba2',
      marginBottom: 12,
    },
    planPrice: {
      fontSize: isMobile ? '1.3rem' : '2rem',
      fontWeight: 700,
      color: '#333',
      marginBottom: 12,
    },
    planList: {
      textAlign: 'left' as const,
      color: '#444',
      margin: '20px 0 0 0',
      padding: 0,
      listStyle: 'none',
      fontSize: '1.05rem',
      lineHeight: 2,
    },
    optionSection: {
      background: '#fff',
      borderRadius: 20,
      boxShadow: '0 4px 20px #bdbdbd22',
      padding: isMobile ? 20 : 36,
      margin: '0 auto 48px auto',
      maxWidth: 900,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
    },
    optionRow: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: isMobile ? 12 : 24,
      justifyContent: 'center',
      width: '100%',
    },
    optionCard: {
      minWidth: isMobile ? 120 : 180, // ←数値で統一
      maxWidth: isMobile ? '98%' : 280, // ←%は文字列、pxは数値
      flex: '1 1 220px',
      margin: '0 8px',
      marginBottom: 16,
    },
    optionTitle: {
      fontWeight: 600,
      color: '#333',
      fontSize: '1.05rem',
      marginBottom: 6,
    },
    optionPrice: {
      color: '#764ba2',
      fontWeight: 700,
      fontSize: '1.05rem',
    },
    optionDesc: {
      fontSize: 13,
      color: '#888',
      marginTop: 6,
    },
    comingSoon: {
      background: '#ffb300',
      color: '#fff',
      borderRadius: 8,
      padding: '2px 12px',
      fontSize: 13,
      marginLeft: 8,
      display: 'inline-block',
    },
    orderBtn: {
      padding: isMobile ? '14px 24px' : '20px 60px',
      fontSize: isMobile ? '1rem' : '1.2rem',
      background: 'linear-gradient(90deg, #764ba2 0%, #667eea 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: 10,
      fontWeight: 700,
      letterSpacing: 2,
      boxShadow: '0 2px 12px #bdbdbd33',
      cursor: 'pointer',
      transition: 'background 0.2s',
      margin: '48px 0 0 0',
    },
  };

  return (
    <div style={styles.root}>
      <div style={styles.container}>
        <h1 style={styles.title}>Bflow プラン・オプション</h1>
        <p style={styles.desc}>ご利用用途や規模に合わせて最適なプランをお選びいただけます。</p>

        {/* プラン一覧 */}
        <div style={styles.planRow}>
          {/* ライトプラン */}
          <div style={styles.planCard}>
            <h2 style={styles.planTitle}>ライトプラン</h2>
            <div style={styles.planPrice}>¥30,000<span style={{ fontSize: '1rem', color: '#888' }}>/回（税別）</span></div>
            <ul style={styles.planList}>
              <li>・来場者カウント</li>
              <li>・スタッフ判定除外</li>
              <li>・時間帯別グラフ表示</li>
              <li>・平均滞在時間の可視化</li>
            </ul>
          </div>
          {/* ベーシックプラン */}
          <div style={{ ...styles.planCard, ...styles.planCardFeatured }}>
            <div style={styles.badge}>おすすめ</div>
            <h2 style={styles.planTitle}>ベーシックプラン</h2>
            <div style={styles.planPrice}>¥60,000<span style={{ fontSize: '1rem', color: '#888' }}>（税別）</span></div>
            <ul style={styles.planList}>
              <li>・ライトプランの全機能</li>
              <li>・リアルタイムダッシュボード</li>
              <li>・機会損失判定</li>
              <li>・接触率算出</li>
              <li>・機会損失率グラフ</li>
            </ul>
          </div>
        </div>

        {/* オプション */}
        <div style={styles.optionSection}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#4f3ca7', marginBottom: 20 }}>オプション</h2>
          <div style={styles.optionRow}>
            <div style={styles.optionCard}>
              <div style={styles.optionTitle}>設置作業サポート（設営撤去込み）</div>
              <div style={styles.optionPrice}>¥20,000</div>
            </div>
            <div style={{ ...styles.optionCard, opacity: 0.7, position: 'relative' }}>
              <div style={styles.optionTitle}>
                Slack通知連携
                <span style={styles.comingSoon}>Coming Soon</span>
              </div>
              <div style={styles.optionPrice}>¥10,000</div>
              <div style={styles.optionDesc}>今後公開予定の機能です</div>
            </div>
            <div style={styles.optionCard}>
              <div style={styles.optionTitle}>全会期データ抽出プラン</div>
              <div style={styles.optionPrice}>月額 ¥20,000</div>
              <div style={styles.optionDesc}>過去の展示会（前回分含む）のデータアクセス・抽出が可能</div>
            </div>
          </div>
        </div>

        {/* 発注ボタン */}
        <div>
          <button style={styles.orderBtn}>
            発注
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanOption; 