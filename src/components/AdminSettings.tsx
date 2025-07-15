import React, { useState } from "react";

const ADMIN_PASSWORD = "admin2025";

const AdminSettings: React.FC = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ここでAPI送信や保存処理を実装
    alert("設定を送信しました\n" + JSON.stringify(form, null, 2));
  };

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 16px #0001", padding: 32 }}>
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
          <button type="submit" style={{ padding: 12, background: "#764ba2", color: "#fff", border: "none", borderRadius: 6, fontWeight: 700 }}>設定を送信</button>
        </form>
      )}
    </div>
  );
};

export default AdminSettings; 