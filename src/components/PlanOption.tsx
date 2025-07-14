import React from "react";
import "../index.css";

const PlanOption: React.FC = () => {
  return (
    <div style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)', minHeight: '100vh', padding: '0' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 16px 0 16px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#4f3ca7', marginBottom: 8 }}>Bflow プラン・オプション</h1>
        <p style={{ color: '#555', marginBottom: 40 }}>ご利用用途や規模に合わせて最適なプランをお選びいただけます。</p>

        {/* プラン一覧 */}
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 40 }}>
          {/* ライトプラン */}
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #bdbdbd22', padding: 32, minWidth: 260, flex: 1, maxWidth: 340 }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#764ba2', marginBottom: 8 }}>ライトプラン</h2>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#333', marginBottom: 8 }}>¥30,000<span style={{ fontSize: '1rem', color: '#888' }}>/回（税別）</span></div>
            <ul style={{ textAlign: 'left', color: '#444', margin: '16px 0 0 0', padding: 0, listStyle: 'none' }}>
              <li>・来場者カウント</li>
              <li>・スタッフ判定除外</li>
              <li>・時間帯別グラフ表示</li>
              <li>・平均滞在時間の可視化</li>
            </ul>
          </div>
          {/* ベーシックプラン */}
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #bdbdbd22', padding: 32, minWidth: 260, flex: 1, maxWidth: 340, border: '2px solid #764ba2', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', background: '#764ba2', color: '#fff', borderRadius: 12, padding: '4px 16px', fontSize: 14, fontWeight: 600, letterSpacing: 1 }}>おすすめ</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#764ba2', marginBottom: 8, marginTop: 10 }}>ベーシックプラン</h2>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#333', marginBottom: 8 }}>¥60,000<span style={{ fontSize: '1rem', color: '#888' }}>（税別）</span></div>
            <ul style={{ textAlign: 'left', color: '#444', margin: '16px 0 0 0', padding: 0, listStyle: 'none' }}>
              <li>・ライトプランの全機能</li>
              <li>・リアルタイムダッシュボード</li>
              <li>・機会損失判定</li>
              <li>・接触率算出</li>
              <li>・機会損失率グラフ</li>
            </ul>
          </div>
        </div>

        {/* オプション */}
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #bdbdbd22', padding: 32, margin: '0 auto 40px auto', maxWidth: 700 }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#4f3ca7', marginBottom: 16 }}>オプション</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
            <div style={{ minWidth: 180, flex: 1 }}>
              <div style={{ fontWeight: 600, color: '#333' }}>設置作業サポート（設営撤去込み）</div>
              <div style={{ color: '#764ba2', fontWeight: 700 }}>¥20,000</div>
            </div>
            <div style={{ minWidth: 180, flex: 1, opacity: 0.7, position: 'relative' }}>
              <div style={{ fontWeight: 600, color: '#333', display: 'flex', alignItems: 'center', gap: 8 }}>
                Slack通知連携
                <span style={{ background: '#ffb300', color: '#fff', borderRadius: 8, padding: '2px 8px', fontSize: 12, marginLeft: 8 }}>Coming Soon</span>
              </div>
              <div style={{ color: '#764ba2', fontWeight: 700 }}>¥10,000</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>今後公開予定の機能です</div>
            </div>
            <div style={{ minWidth: 180, flex: 1 }}>
              <div style={{ fontWeight: 600, color: '#333' }}>全会期データ抽出プラン</div>
              <div style={{ color: '#764ba2', fontWeight: 700 }}>月額 ¥20,000</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>過去の展示会（前回分含む）のデータアクセス・抽出が可能</div>
            </div>
          </div>
        </div>

        {/* 発注ボタン */}
        <div style={{ margin: '40px 0 0 0' }}>
          <button style={{ padding: '18px 56px', fontSize: '1.3rem', background: 'linear-gradient(90deg, #764ba2 0%, #667eea 100%)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, letterSpacing: 2, boxShadow: '0 2px 8px #bdbdbd33', cursor: 'pointer', transition: 'background 0.2s' }}>
            発注
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanOption; 