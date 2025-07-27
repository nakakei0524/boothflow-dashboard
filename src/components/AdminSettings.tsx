import React, { useState } from "react";
import { useCompany } from "../contexts/CompanyContext";

const ADMIN_PASSWORD = "admin2025";

const AdminSettings: React.FC = () => {
  const { currentCompany, updateCompanyConfig } = useCompany();
  const [unlocked, setUnlocked] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [form, setForm] = useState({
    device_id: "",
    session_id: "",
    capture_interval: 5,
    entry_line: "[[100,200],[400,200]]",
    loss_zone: "[[100,300],[400,300],[400,400],[100,400]]",
  });
  const [planSettings, setPlanSettings] = useState({
    lightPlan: {
      visitorCount: true,
      staffExclusion: true,
      hourlyGraph: true,
      averageTime: true,
      realtimeDashboard: false,
      opportunityLoss: false,
      contactRate: false,
      opportunityLossGraph: false,
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
    },
  });
  const [message, setMessage] = useState("");

  // 初期化時に現在の設定を読み込み
  React.useEffect(() => {
    if (currentCompany?.planFeatures) {
      setPlanSettings(currentCompany.planFeatures);
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

  const handlePlanChange = (plan: 'lightPlan' | 'basicPlan', feature: string) => {
    const newPlanSettings = {
      ...planSettings,
      [plan]: {
        ...planSettings[plan],
        [feature]: !planSettings[plan][feature as keyof typeof planSettings[typeof plan]]
      }
    };
    
    setPlanSettings(newPlanSettings);
    
    // CompanyContextの設定を更新
    updateCompanyConfig({
      planFeatures: newPlanSettings
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ここでAPI送信や保存処理を実装
    alert("設定を送信しました\n" + JSON.stringify({ ...form, planSettings }, null, 2));
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 16px #0001", padding: 32 }}>
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
          
          <h3 style={{ marginTop: 32, marginBottom: 16, color: "#333" }}>プラン別機能制限設定</h3>
          
          <div style={{ display: "flex", gap: 24 }}>
            {/* ライトプラン */}
            <div style={{ flex: 1, padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
              <h4 style={{ marginBottom: 16, color: "#667eea", fontWeight: 700 }}>ライトプラン</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planSettings.lightPlan.visitorCount}
                    onChange={() => handlePlanChange('lightPlan', 'visitorCount')}
                  />
                  来場者のカウント
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planSettings.lightPlan.staffExclusion}
                    onChange={() => handlePlanChange('lightPlan', 'staffExclusion')}
                  />
                  スタッフ判定除外
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planSettings.lightPlan.hourlyGraph}
                    onChange={() => handlePlanChange('lightPlan', 'hourlyGraph')}
                  />
                  時間帯別グラフ表示
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planSettings.lightPlan.averageTime}
                    onChange={() => handlePlanChange('lightPlan', 'averageTime')}
                  />
                  平均時間の可視化
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planSettings.lightPlan.realtimeDashboard}
                    onChange={() => handlePlanChange('lightPlan', 'realtimeDashboard')}
                  />
                  リアルタイムダッシュボード
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planSettings.lightPlan.opportunityLoss}
                    onChange={() => handlePlanChange('lightPlan', 'opportunityLoss')}
                  />
                  機会損失判定
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planSettings.lightPlan.contactRate}
                    onChange={() => handlePlanChange('lightPlan', 'contactRate')}
                  />
                  接触率
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planSettings.lightPlan.opportunityLossGraph}
                    onChange={() => handlePlanChange('lightPlan', 'opportunityLossGraph')}
                  />
                  機会損失グラフ
                </label>
              </div>
            </div>
            
            {/* ベーシックプラン */}
            <div style={{ flex: 1, padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
              <h4 style={{ marginBottom: 16, color: "#764ba2", fontWeight: 700 }}>ベーシックプラン</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planSettings.basicPlan.visitorCount}
                    onChange={() => handlePlanChange('basicPlan', 'visitorCount')}
                  />
                  来場者のカウント
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planSettings.basicPlan.staffExclusion}
                    onChange={() => handlePlanChange('basicPlan', 'staffExclusion')}
                  />
                  スタッフ判定除外
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planSettings.basicPlan.hourlyGraph}
                    onChange={() => handlePlanChange('basicPlan', 'hourlyGraph')}
                  />
                  時間帯別グラフ表示
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planSettings.basicPlan.averageTime}
                    onChange={() => handlePlanChange('basicPlan', 'averageTime')}
                  />
                  平均時間の可視化
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planSettings.basicPlan.realtimeDashboard}
                    onChange={() => handlePlanChange('basicPlan', 'realtimeDashboard')}
                  />
                  リアルタイムダッシュボード
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planSettings.basicPlan.opportunityLoss}
                    onChange={() => handlePlanChange('basicPlan', 'opportunityLoss')}
                  />
                  機会損失判定
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planSettings.basicPlan.contactRate}
                    onChange={() => handlePlanChange('basicPlan', 'contactRate')}
                  />
                  接触率
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={planSettings.basicPlan.opportunityLossGraph}
                    onChange={() => handlePlanChange('basicPlan', 'opportunityLossGraph')}
                  />
                  機会損失グラフ
                </label>
              </div>
            </div>
          </div>
          
          <button type="submit" style={{ padding: 12, background: "#764ba2", color: "#fff", border: "none", borderRadius: 6, fontWeight: 700, marginTop: 16 }}>設定を送信</button>
        </form>
      )}
    </div>
  );
};

export default AdminSettings; 