import React from "react";
import "../index.css";

const isMobile = () => window.innerWidth <= 600;

const PlanOption: React.FC = () => {
  // 横並びを強制するスタイル
  const planRowStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: isMobile() ? 'column' : 'row',
    gap: isMobile() ? 32 : 48,
    justifyContent: 'center',
    alignItems: 'stretch',
    marginBottom: 56,
    flexWrap: isMobile() ? 'wrap' : 'nowrap',
    overflowX: isMobile() ? 'visible' : 'auto',
  };
  const optionRowStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: isMobile() ? 'column' : 'row',
    gap: isMobile() ? 24 : 40,
    justifyContent: 'center',
    alignItems: 'stretch',
    width: '100%',
    flexWrap: isMobile() ? 'wrap' : 'nowrap',
    overflowX: isMobile() ? 'visible' : 'auto',
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)', minHeight: '100vh', padding: '0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 16px 0 16px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 700, color: '#4f3ca7', marginBottom: 16, letterSpacing: 1 }}>Bflow プラン・オプション</h1>
        <p style={{ color: '#555', marginBottom: 56, fontSize: '1.15rem', lineHeight: 2 }}>ご利用用途や規模に合わせて最適なプランをお選びいただけます。</p>

        {/* プラン一覧 */}
        <div style={planRowStyle}>
          {/* ライトプラン */}
          <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 6px 32px #bdbdbd22', padding: 48, minWidth: 320, maxWidth: 400, flex: 1, margin: '0 12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 600, color: '#764ba2', marginBottom: 16 }}>ライトプラン</h2>
            <div style={{ fontSize: '2.3rem', fontWeight: 700, color: '#333', marginBottom: 16 }}>¥30,000<span style={{ fontSize: '1.1rem', color: '#888' }}>/回（税別）</span></div>
            <ul style={{ textAlign: 'left', color: '#444', margin: '24px 0 0 0', padding: 0, listStyle: 'none', fontSize: '1.1rem', lineHeight: 2 }}>
              <li>・来場者カウント</li>
              <li>・スタッフ判定除外</li>
              <li>・時間帯別グラフ表示</li>
              <li>・平均滞在時間の可視化</li>
            </ul>
          </div>
          {/* ベーシックプラン */}
          <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 6px 32px #bdbdbd22', padding: 48, minWidth: 320, maxWidth: 400, flex: 1, margin: '0 12px', border: '2.5px solid #764ba2', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 72 }}>
            <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', background: '#764ba2', color: '#fff', borderRadius: 14, padding: '6px 24px', fontSize: 16, fontWeight: 600, letterSpacing: 1, boxShadow: '0 2px 8px #bdbdbd33', zIndex: 2 }}>おすすめ</div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 600, color: '#764ba2', marginBottom: 16, marginTop: 18 }}>ベーシックプラン</h2>
            <div style={{ fontSize: '2.3rem', fontWeight: 700, color: '#333', marginBottom: 16 }}>¥60,000<span style={{ fontSize: '1.1rem', color: '#888' }}>（税別）</span></div>
            <ul style={{ textAlign: 'left', color: '#444', margin: '24px 0 0 0', padding: 0, listStyle: 'none', fontSize: '1.1rem', lineHeight: 2 }}>
              <li>・ライトプランの全機能</li>
              <li>・リアルタイムダッシュボード</li>
              <li>・機会損失判定</li>
              <li>・接触率算出</li>
              <li>・機会損失率グラフ</li>
            </ul>
          </div>
        </div>

        {/* オプション */}
        <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 4px 20px #bdbdbd22', padding: 48, margin: '0 auto 56px auto', maxWidth: 900, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#4f3ca7', marginBottom: 28 }}>オプション</h2>
          <div style={optionRowStyle}>
            <div style={{ minWidth: 200, maxWidth: 300, flex: 1 }}>
              <div style={{ fontWeight: 600, color: '#333', fontSize: '1.1rem', marginBottom: 6 }}>設置作業サポート（設営撤去込み）</div>
              <div style={{ color: '#764ba2', fontWeight: 700, fontSize: '1.1rem' }}>¥20,000</div>
            </div>
            <div style={{ minWidth: 200, maxWidth: 300, flex: 1, opacity: 0.7, position: 'relative' }}>
              <div style={{ fontWeight: 600, color: '#333', display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.1rem', marginBottom: 6 }}>
                Slack通知連携
                <span style={{ background: '#ffb300', color: '#fff', borderRadius: 8, padding: '2px 12px', fontSize: 13, marginLeft: 8 }}>Coming Soon</span>
              </div>
              <div style={{ color: '#764ba2', fontWeight: 700, fontSize: '1.1rem' }}>¥10,000</div>
              <div style={{ fontSize: 13, color: '#888', marginTop: 6 }}>今後公開予定の機能です</div>
            </div>
            <div style={{ minWidth: 200, maxWidth: 300, flex: 1 }}>
              <div style={{ fontWeight: 600, color: '#333', fontSize: '1.1rem', marginBottom: 6 }}>全会期データ抽出プラン</div>
              <div style={{ color: '#764ba2', fontWeight: 700, fontSize: '1.1rem' }}>月額 ¥20,000</div>
              <div style={{ fontSize: 13, color: '#888', marginTop: 6 }}>過去の展示会（前回分含む）のデータアクセス・抽出が可能</div>
            </div>
          </div>
        </div>

        {/* 発注ボタン */}
        <div style={{ margin: '56px 0 0 0' }}>
          <button style={{ padding: '22px 72px', fontSize: '1.4rem', background: 'linear-gradient(90deg, #764ba2 0%, #667eea 100%)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, letterSpacing: 2, boxShadow: '0 2px 12px #bdbdbd33', cursor: 'pointer', transition: 'background 0.2s' }}>
            発注
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanOption; 