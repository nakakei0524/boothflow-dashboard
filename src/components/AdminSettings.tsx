import React, { useState } from "react";
import { useCompany } from "../contexts/CompanyContext";

const ADMIN_PASSWORD = "admin2025";

const AdminSettings: React.FC = () => {
  const { currentCompany, updateCompanyConfig, setPlan, selectedPlan } = useCompany();
  const [unlocked, setUnlocked] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [form, setForm] = useState({
    device_id: "",
    session_id: "",
    capture_interval: 5,
    entry_line: "[[100,200],[400,200]]",
    loss_zone: "[[100,300],[400,300],[400,400],[100,400]]",
  });
  const [message, setMessage] = useState("");

  // プラン名のマッピング
  const planNameMap = {
    lightPlan: "ライトプラン",
    basicPlan: "ベーシックプラン",
    enterprisePlan: "月額プラン"
  };

  // プラン別の機能設定
  const planFeatures = {
    lightPlan: {
      visitorCount: true,
      staffExclusion: true,
      hourlyGraph: true,
      averageTime: false,
      realtimeDashboard: false,
      opportunityLoss: false,
      contactRate: false,
      opportunityLossGraph: false,
      searchDashboard: false,
    },
    basicPlan: {
      visitorCount: true,
      staffExclusion: true,
      hourlyGraph: true,
      averageTime: false,
      realtimeDashboard: true,
      opportunityLoss: true,
      contactRate: true,
      opportunityLossGraph: true,
      searchDashboard: false,
    },
    enterprisePlan: {
      visitorCount: true,
      staffExclusion: true,
      hourlyGraph: true,
      averageTime: true,
      realtimeDashboard: true,
      opportunityLoss: true,
      contactRate: true,
      opportunityLossGraph: true,
      searchDashboard: true,
    },
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPassword === ADMIN_PASSWORD) {
      setUnlocked(true);
      setMessage("");
    } else {
      setMessage("パスワードが違います");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlanChange = (plan: string) => {
    setPlan(plan);
    // プラン変更時に機能設定も更新
    const selectedPlanFeatures = planFeatures[plan as keyof typeof planFeatures];
    updateCompanyConfig({
      planFeatures: {
        lightPlan: planFeatures.lightPlan,
        basicPlan: planFeatures.basicPlan,
        enterprisePlan: planFeatures.enterprisePlan,
        [plan]: selectedPlanFeatures
      }
    });
    alert(`${planNameMap[plan as keyof typeof planNameMap]}に切り替えました！`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ここでAPI送信や保存処理を実装
    alert("設定を送信しました\n" + JSON.stringify(form, null, 2));
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 16px #0001", padding: 32 }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>管理者設定</h2>
      {!unlocked ? (
        <form onSubmit={handleUnlock} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <label>管理者パスワード
            <input type="password" value={inputPassword} onChange={e => setInputPassword(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 8 }} />
          </label>
          {message && <div style={{ color: "red", fontWeight: 600 }}>{message}</div>}
          <button type="submit" style={{ padding: 10, background: "#667eea", color: "#fff", border: "none", borderRadius: 6, fontWeight: 700 }}>ロック解除</button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <h3 style={{ marginBottom: 16, color: "#333" }}>基本設定</h3>
          <label>device_id
            <input name="device_id" value={form.device_id} onChange={handleChange} style={{ width: "100%", padding: 8, marginTop: 8 }} />
          </label>
          <label>session_id
            <input name="session_id" value={form.session_id} onChange={handleChange} style={{ width: "100%", padding: 8, marginTop: 8 }} />
          </label>
          <label>capture_interval（秒）
            <input name="capture_interval" type="number" value={form.capture_interval} onChange={handleChange} style={{ width: "100%", padding: 8, marginTop: 8 }} />
          </label>
          <label>entry_line（例: [[100,200],[400,200]]）
            <input name="entry_line" value={form.entry_line} onChange={handleChange} style={{ width: "100%", padding: 8, marginTop: 8 }} />
          </label>
          <label>loss_zone（例: [[100,300],[400,300],[400,400],[100,400]]）
            <textarea name="loss_zone" value={form.loss_zone} onChange={handleChange} style={{ width: "100%", padding: 8, marginTop: 8, minHeight: 60 }} />
          </label>
          
          <h3 style={{ marginTop: 32, marginBottom: 16, color: "#333" }}>プラン切り替え</h3>
          
          {/* 現在のプラン表示 */}
          <div style={{ 
            padding: 16, 
            background: "#f8f9fa", 
            borderRadius: 8, 
            border: "1px solid #dee2e6",
            marginBottom: 16
          }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>現在のプラン:</div>
            <div style={{ 
              fontSize: 18, 
              fontWeight: 700, 
              color: "#667eea",
              display: "flex",
              alignItems: "center",
              gap: 8
            }}>
              {planNameMap[selectedPlan as keyof typeof planNameMap]}
              <span style={{ 
                fontSize: 12, 
                background: "#28a745", 
                color: "#fff", 
                padding: "4px 8px", 
                borderRadius: 4 
              }}>
                アクティブ
              </span>
            </div>
          </div>

          {/* プラン選択ボタン */}
          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            <button
              type="button"
              onClick={() => handlePlanChange('lightPlan')}
              style={{
                flex: 1,
                padding: "12px 16px",
                background: selectedPlan === 'lightPlan' ? "#667eea" : "#f8f9fa",
                color: selectedPlan === 'lightPlan' ? "#fff" : "#333",
                border: "1px solid #667eea",
                borderRadius: 8,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              ライトプラン
            </button>
            <button
              type="button"
              onClick={() => handlePlanChange('basicPlan')}
              style={{
                flex: 1,
                padding: "12px 16px",
                background: selectedPlan === 'basicPlan' ? "#764ba2" : "#f8f9fa",
                color: selectedPlan === 'basicPlan' ? "#fff" : "#333",
                border: "1px solid #764ba2",
                borderRadius: 8,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              ベーシックプラン
            </button>
            <button
              type="button"
              onClick={() => handlePlanChange('enterprisePlan')}
              style={{
                flex: 1,
                padding: "12px 16px",
                background: selectedPlan === 'enterprisePlan' ? "#27ae60" : "#f8f9fa",
                color: selectedPlan === 'enterprisePlan' ? "#fff" : "#333",
                border: "1px solid #27ae60",
                borderRadius: 8,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              月額プラン
            </button>
          </div>

          {/* プラン別機能説明 */}
          <div style={{ marginTop: 24 }}>
            <h4 style={{ marginBottom: 16, color: "#333" }}>プラン別機能</h4>
            
            {/* ライトプラン */}
            <div style={{ 
              padding: 16, 
              border: "1px solid #667eea", 
              borderRadius: 8, 
              background: "#f8f9ff",
              marginBottom: 12
            }}>
              <h5 style={{ color: "#667eea", fontWeight: 700, marginBottom: 8 }}>ライトプラン</h5>
              <ul style={{ margin: 0, paddingLeft: 20, color: "#666" }}>
                <li>来場者カウント</li>
                <li>スタッフ除外</li>
                <li>時間帯別グラフ</li>
              </ul>
            </div>

            {/* ベーシックプラン */}
            <div style={{ 
              padding: 16, 
              border: "1px solid #764ba2", 
              borderRadius: 8, 
              background: "#f8f4ff",
              marginBottom: 12
            }}>
              <h5 style={{ color: "#764ba2", fontWeight: 700, marginBottom: 8 }}>ベーシックプラン</h5>
              <ul style={{ margin: 0, paddingLeft: 20, color: "#666" }}>
                <li>ライトプラン全て</li>
                <li>時間帯別グラフ（接触数・来場者数・機会損失数）</li>
                <li>機会損失判定</li>
                <li>接触率算出</li>
                <li>機会損失グラフ</li>
              </ul>
            </div>

            {/* 月額プラン */}
            <div style={{ 
              padding: 16, 
              border: "1px solid #27ae60", 
              borderRadius: 8, 
              background: "#f4fff8"
            }}>
              <h5 style={{ color: "#27ae60", fontWeight: 700, marginBottom: 8 }}>月額プラン（月額2万円＋1会期利用料）</h5>
              <ul style={{ margin: 0, paddingLeft: 20, color: "#666" }}>
                <li>全機能有効</li>
                <li>過去データ検索機能解禁</li>
              </ul>
            </div>
          </div>

          <button type="submit" style={{ padding: 12, background: "#764ba2", color: "#fff", border: "none", borderRadius: 6, fontWeight: 700, marginTop: 16 }}>設定を送信</button>
        </form>
      )}
    </div>
  );
};

export default AdminSettings; 