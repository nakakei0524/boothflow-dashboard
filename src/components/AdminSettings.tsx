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
  const [planFeatures, setPlanFeatures] = useState({
    lightPlan: {
      visitorCount: true,
      staffExclusion: true,
      hourlyGraph: true,
      averageTime: true,
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
      averageTime: true,
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
  });

  // 初期化時に現在の設定を読み込み
  React.useEffect(() => {
    if (currentCompany?.planFeatures) {
      setPlanFeatures(currentCompany.planFeatures);
      console.log("現在のプラン設定:", currentCompany.planFeatures);
      console.log("現在選択されているプラン:", selectedPlan);
    }
  }, [currentCompany, selectedPlan]);

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

  const handleFeatureChange = (plan: string, feature: string, checked: boolean) => {
    setPlanFeatures(prev => ({
      ...prev,
      [plan]: {
        ...prev[plan as keyof typeof prev],
        [feature]: checked
      }
    }));
  };

  const handleSaveFeatures = () => {
    updateCompanyConfig({
      planFeatures: planFeatures
    });
    alert("機能制限設定を保存しました！");
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
          
          <h3 style={{ marginTop: 32, marginBottom: 16, color: "#333" }}>詳細機能制限設定</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* ライトプラン詳細設定 */}
            <div style={{ padding: 20, border: "1px solid #667eea", borderRadius: 8, background: "#f8f9ff" }}>
              <h4 style={{ color: "#667eea", fontWeight: 700, marginBottom: 12 }}>ライトプラン機能制限</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planFeatures.lightPlan.visitorCount}
                    onChange={(e) => handleFeatureChange('lightPlan', 'visitorCount', e.target.checked)}
                  />
                  来場者カウント
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planFeatures.lightPlan.staffExclusion}
                    onChange={(e) => handleFeatureChange('lightPlan', 'staffExclusion', e.target.checked)}
                  />
                  スタッフ除外
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planFeatures.lightPlan.hourlyGraph}
                    onChange={(e) => handleFeatureChange('lightPlan', 'hourlyGraph', e.target.checked)}
                  />
                  時間帯別グラフ
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planFeatures.lightPlan.averageTime}
                    onChange={(e) => handleFeatureChange('lightPlan', 'averageTime', e.target.checked)}
                  />
                  平均滞在時間
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planFeatures.lightPlan.realtimeDashboard}
                    onChange={(e) => handleFeatureChange('lightPlan', 'realtimeDashboard', e.target.checked)}
                  />
                  リアルタイムダッシュボード
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planFeatures.lightPlan.opportunityLoss}
                    onChange={(e) => handleFeatureChange('lightPlan', 'opportunityLoss', e.target.checked)}
                  />
                  機会損失判定
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planFeatures.lightPlan.contactRate}
                    onChange={(e) => handleFeatureChange('lightPlan', 'contactRate', e.target.checked)}
                  />
                  接触率
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planFeatures.lightPlan.opportunityLossGraph}
                    onChange={(e) => handleFeatureChange('lightPlan', 'opportunityLossGraph', e.target.checked)}
                  />
                  機会損失グラフ
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planFeatures.lightPlan.searchDashboard}
                    onChange={(e) => handleFeatureChange('lightPlan', 'searchDashboard', e.target.checked)}
                  />
                  過去データ検索
                </label>
              </div>
            </div>

            {/* ベーシックプラン詳細設定 */}
            <div style={{ padding: 20, border: "1px solid #764ba2", borderRadius: 8, background: "#f8f4ff" }}>
              <h4 style={{ color: "#764ba2", fontWeight: 700, marginBottom: 12 }}>ベーシックプラン機能制限</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planFeatures.basicPlan.visitorCount}
                    onChange={(e) => handleFeatureChange('basicPlan', 'visitorCount', e.target.checked)}
                  />
                  来場者カウント
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planFeatures.basicPlan.staffExclusion}
                    onChange={(e) => handleFeatureChange('basicPlan', 'staffExclusion', e.target.checked)}
                  />
                  スタッフ除外
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planFeatures.basicPlan.hourlyGraph}
                    onChange={(e) => handleFeatureChange('basicPlan', 'hourlyGraph', e.target.checked)}
                  />
                  時間帯別グラフ
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planFeatures.basicPlan.averageTime}
                    onChange={(e) => handleFeatureChange('basicPlan', 'averageTime', e.target.checked)}
                  />
                  平均滞在時間
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planFeatures.basicPlan.realtimeDashboard}
                    onChange={(e) => handleFeatureChange('basicPlan', 'realtimeDashboard', e.target.checked)}
                  />
                  リアルタイムダッシュボード
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planFeatures.basicPlan.opportunityLoss}
                    onChange={(e) => handleFeatureChange('basicPlan', 'opportunityLoss', e.target.checked)}
                  />
                  機会損失判定
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planFeatures.basicPlan.contactRate}
                    onChange={(e) => handleFeatureChange('basicPlan', 'contactRate', e.target.checked)}
                  />
                  接触率
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planFeatures.basicPlan.opportunityLossGraph}
                    onChange={(e) => handleFeatureChange('basicPlan', 'opportunityLossGraph', e.target.checked)}
                  />
                  機会損失グラフ
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planFeatures.basicPlan.searchDashboard}
                    onChange={(e) => handleFeatureChange('basicPlan', 'searchDashboard', e.target.checked)}
                  />
                  過去データ検索
                </label>
              </div>
            </div>

            {/* エンタープライズプラン詳細設定 */}
            <div style={{ padding: 20, border: "1px solid #27ae60", borderRadius: 8, background: "#f4fff8" }}>
              <h4 style={{ color: "#27ae60", fontWeight: 700, marginBottom: 12 }}>エンタープライズプラン機能制限</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planFeatures.enterprisePlan.visitorCount}
                    onChange={(e) => handleFeatureChange('enterprisePlan', 'visitorCount', e.target.checked)}
                  />
                  来場者カウント
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planFeatures.enterprisePlan.staffExclusion}
                    onChange={(e) => handleFeatureChange('enterprisePlan', 'staffExclusion', e.target.checked)}
                  />
                  スタッフ除外
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planFeatures.enterprisePlan.hourlyGraph}
                    onChange={(e) => handleFeatureChange('enterprisePlan', 'hourlyGraph', e.target.checked)}
                  />
                  時間帯別グラフ
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planFeatures.enterprisePlan.averageTime}
                    onChange={(e) => handleFeatureChange('enterprisePlan', 'averageTime', e.target.checked)}
                  />
                  平均滞在時間
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planFeatures.enterprisePlan.realtimeDashboard}
                    onChange={(e) => handleFeatureChange('enterprisePlan', 'realtimeDashboard', e.target.checked)}
                  />
                  リアルタイムダッシュボード
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planFeatures.enterprisePlan.opportunityLoss}
                    onChange={(e) => handleFeatureChange('enterprisePlan', 'opportunityLoss', e.target.checked)}
                  />
                  機会損失判定
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planFeatures.enterprisePlan.contactRate}
                    onChange={(e) => handleFeatureChange('enterprisePlan', 'contactRate', e.target.checked)}
                  />
                  接触率
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planFeatures.enterprisePlan.opportunityLossGraph}
                    onChange={(e) => handleFeatureChange('enterprisePlan', 'opportunityLossGraph', e.target.checked)}
                  />
                  機会損失グラフ
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planFeatures.enterprisePlan.searchDashboard}
                    onChange={(e) => handleFeatureChange('enterprisePlan', 'searchDashboard', e.target.checked)}
                  />
                  過去データ検索
                </label>
              </div>
            </div>
          </div>

          <button 
            type="button" 
            onClick={handleSaveFeatures}
            style={{ 
              padding: "12px 24px", 
              background: "#28a745", 
              color: "#fff", 
              border: "none", 
              borderRadius: 8, 
              fontWeight: 700,
              cursor: "pointer",
              marginTop: 16
            }}
          >
            機能制限設定を保存
          </button>
          <button type="submit" style={{ padding: 12, background: "#764ba2", color: "#fff", border: "none", borderRadius: 6, fontWeight: 700, marginTop: 16 }}>設定を送信</button>
        </form>
      )}
    </div>
  );
};

export default AdminSettings; 