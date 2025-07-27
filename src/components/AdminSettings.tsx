import React, { useState } from "react";
import { useCompany } from "../contexts/CompanyContext";

const ADMIN_PASSWORD = "admin2025";

// プラン別の機能設定
const PLAN_CONFIGS = {
  lightPlan: {
    name: "ライトプラン",
    price: "¥30,000 / 会期",
    target: "初回導入・効果検証",
    features: {
      visitorCount: true,
      staffExclusion: true,
      averageTime: true,
      hourlyGraph: true,
      realtimeDashboard: false,
      opportunityLoss: false,
      contactRate: false,
      opportunityLossGraph: false,
    }
  },
  basicPlan: {
    name: "ベーシックプラン",
    price: "¥60,000 / 会期",
    target: "改善提案・レポート重視層",
    features: {
      visitorCount: true,
      staffExclusion: true,
      averageTime: true,
      hourlyGraph: true,
      realtimeDashboard: true,
      opportunityLoss: true,
      contactRate: true,
      opportunityLossGraph: true,
    }
  },
  enterprisePlan: {
    name: "エンタープライズプラン",
    price: "¥120,000〜 / 会期",
    target: "大規模・多拠点ブース運営企業",
    features: {
      visitorCount: true,
      staffExclusion: true,
      averageTime: true,
      hourlyGraph: true,
      realtimeDashboard: true,
      opportunityLoss: true,
      contactRate: true,
      opportunityLossGraph: true,
    }
  }
};

const AdminSettings: React.FC = () => {
  const { currentCompany, updateCompanyConfig, setPlan } = useCompany();
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

  // 初期化時に現在の設定を読み込み
  React.useEffect(() => {
    if (currentCompany?.planFeatures) {
      // 現在の設定を確認
      console.log("現在のプラン設定:", currentCompany.planFeatures);
    }
  }, [currentCompany]);

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

  const handlePlanChange = (planKey: 'lightPlan' | 'basicPlan' | 'enterprisePlan') => {
    const planConfig = PLAN_CONFIGS[planKey];
    
    // CompanyContextの設定を更新
    updateCompanyConfig({
      planFeatures: {
        lightPlan: planConfig.features,
        basicPlan: planConfig.features,
        enterprisePlan: planConfig.features
      }
    });
    setPlan(planKey);
    
    alert(`${planConfig.name}の機能設定を適用しました！`);
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
          
          <h3 style={{ marginTop: 32, marginBottom: 16, color: "#333" }}>プラン別機能設定</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* ライトプラン */}
            <div style={{ padding: 20, border: "2px solid #667eea", borderRadius: 12, background: "#f8f9ff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h4 style={{ color: "#667eea", fontWeight: 700, fontSize: 18 }}>{PLAN_CONFIGS.lightPlan.name}</h4>
                <span style={{ color: "#667eea", fontWeight: 600 }}>{PLAN_CONFIGS.lightPlan.price}</span>
              </div>
              <p style={{ color: "#666", marginBottom: 16, fontSize: 14 }}>{PLAN_CONFIGS.lightPlan.target}</p>
              <div style={{ marginBottom: 16 }}>
                <strong style={{ color: "#333" }}>提供内容:</strong>
                <p style={{ color: "#666", fontSize: 14, marginTop: 4 }}>来場者カウント / スタッフ除外 / 平均滞在時間 / 時間帯別グラフ</p>
              </div>
              <button 
                type="button"
                onClick={() => handlePlanChange('lightPlan')}
                style={{ 
                  padding: "12px 24px", 
                  background: "#667eea", 
                  color: "#fff", 
                  border: "none", 
                  borderRadius: 8, 
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                ライトプランを適用
              </button>
            </div>
            
            {/* ベーシックプラン */}
            <div style={{ padding: 20, border: "2px solid #764ba2", borderRadius: 12, background: "#f8f4ff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h4 style={{ color: "#764ba2", fontWeight: 700, fontSize: 18 }}>{PLAN_CONFIGS.basicPlan.name}</h4>
                <span style={{ color: "#764ba2", fontWeight: 600 }}>{PLAN_CONFIGS.basicPlan.price}</span>
              </div>
              <p style={{ color: "#666", marginBottom: 16, fontSize: 14 }}>{PLAN_CONFIGS.basicPlan.target}</p>
              <div style={{ marginBottom: 16 }}>
                <strong style={{ color: "#333" }}>提供内容:</strong>
                <p style={{ color: "#666", fontSize: 14, marginTop: 4 }}>ライトプラン + 接触率 / 機会損失判定 / リアルタイムダッシュボード / 接触・損失率グラフ</p>
              </div>
              <button 
                type="button"
                onClick={() => handlePlanChange('basicPlan')}
                style={{ 
                  padding: "12px 24px", 
                  background: "#764ba2", 
                  color: "#fff", 
                  border: "none", 
                  borderRadius: 8, 
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                ベーシックプランを適用
              </button>
            </div>
            
            {/* エンタープライズプラン */}
            <div style={{ padding: 20, border: "2px solid #27ae60", borderRadius: 12, background: "#f4fff8" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h4 style={{ color: "#27ae60", fontWeight: 700, fontSize: 18 }}>{PLAN_CONFIGS.enterprisePlan.name}</h4>
                <span style={{ color: "#27ae60", fontWeight: 600 }}>{PLAN_CONFIGS.enterprisePlan.price}</span>
              </div>
              <p style={{ color: "#666", marginBottom: 16, fontSize: 14 }}>{PLAN_CONFIGS.enterprisePlan.target}</p>
              <div style={{ marginBottom: 16 }}>
                <strong style={{ color: "#333" }}>提供内容:</strong>
                <p style={{ color: "#666", fontSize: 14, marginTop: 4 }}>ベーシックプラン + 複数カメラ / Jetson対応 / 専用Slack通知 / 拡張API連携など（見積ベース）</p>
              </div>
              <button 
                type="button"
                onClick={() => handlePlanChange('enterprisePlan')}
                style={{ 
                  padding: "12px 24px", 
                  background: "#27ae60", 
                  color: "#fff", 
                  border: "none", 
                  borderRadius: 8, 
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                エンタープライズプランを適用
              </button>
            </div>
          </div>
          
          <button type="submit" style={{ padding: 12, background: "#764ba2", color: "#fff", border: "none", borderRadius: 6, fontWeight: 700, marginTop: 16 }}>設定を送信</button>
        </form>
      )}
    </div>
  );
};

export default AdminSettings; 