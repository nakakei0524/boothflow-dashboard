import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { signIn, confirmSignIn, getCurrentUser, signOut } from 'aws-amplify/auth';
import BflowLogo from '../assets/BflowLogo.png';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPasswordField, setShowNewPasswordField] = useState(false);

  // 既存セッションをクリアする関数
  const clearExistingSession = async () => {
    try {
      const currentUser = await getCurrentUser();
      console.log('既存ユーザーを検出:', currentUser.username);
      await signOut();
      console.log('既存セッションをクリアしました');
      // 少し待機してから次の処理へ
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.log('既存セッションなし、またはクリア済み');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください');
      return;
    }
    setLoading(true);
    try {
      // 既存セッションを確実にクリア
      await clearExistingSession();
      
      // ログイン実行
      const res = await signIn({ username: email, password });
      console.log('サインイン結果:', res);
      
      if (res.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        setShowNewPassword(true);
      } else if (res.isSignedIn) {
        // 直接ログイン成功の場合
        await login(email, password);
      } else {
        setError('ログインに失敗しました。再度お試しください。');
      }
    } catch (err: any) {
      console.error('ログインエラー:', err);
      
      // より詳細なエラーメッセージ
      if (err.name === 'UserNotConfirmedException') {
        setError('アカウントが確認されていません。確認メールをご確認ください。');
      } else if (err.name === 'NotAuthorizedException') {
        setError('メールアドレスまたはパスワードが正しくありません。');
      } else if (err.name === 'UserNotFoundException') {
        setError('このメールアドレスは登録されていません。');
      } else if (err.name === 'TooManyRequestsException') {
        setError('ログイン試行回数が上限に達しました。しばらく時間をおいてから再試行してください。');
      } else if (err.message && err.message.includes('already a signed in user')) {
        setError('既にログイン済みです。ページを再読み込みしてください。');
        // 自動的にセッションをクリアして再試行
        setTimeout(async () => {
          try {
            await clearExistingSession();
            setError('');
          } catch (clearError) {
            console.error('セッションクリアエラー:', clearError);
          }
        }, 2000);
      } else {
        setError(err.message || 'ログインに失敗しました。しばらく時間をおいてから再試行してください。');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!newPassword) {
      setError('新しいパスワードを入力してください');
      return;
    }
    if (newPassword.length < 8) {
      setError('パスワードは8文字以上で入力してください');
      return;
    }
    setLoading(true);
    try {
      const res = await confirmSignIn({
        challengeResponse: newPassword
      });
      if (res.isSignedIn) {
        await login(email, newPassword);
        setShowNewPassword(false);
        setNewPassword('');
      } else {
        setError('パスワード変更に失敗しました');
      }
    } catch (err: any) {
      console.error('パスワード変更エラー:', err);
      if (err.name === 'InvalidPasswordException') {
        setError('パスワードは8文字以上で、大文字・小文字・数字・記号を含める必要があります。');
      } else if (err.name === 'LimitExceededException') {
        setError('パスワード変更の試行回数が上限に達しました。しばらく時間をおいてから再試行してください。');
      } else {
        setError(err.message || 'パスワード変更に失敗しました。しばらく時間をおいてから再試行してください。');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fff',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <form className="login-card" style={{
        background: '#fff',
        borderRadius: '20px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
        padding: '40px 32px 32px 32px',
        minWidth: 320,
        maxWidth: 380,
        width: '90vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 1,
        border: '1px solid #e3e8f0',
      }} onSubmit={showNewPassword ? handleNewPassword : handleSubmit}>
        <img src={BflowLogo} alt="Bflow Logo" style={{
          width: 160,
          marginBottom: 32,
          marginTop: 8,
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
          boxShadow: '0 4px 16px rgba(37,99,235,0.08)',
          borderRadius: '12px',
          background: '#f8fafc',
          padding: 12,
        }} />
        
        {showNewPassword ? (
          <>
            <div style={{ width: '100%', marginBottom: 16 }}>
              <label style={{ fontWeight: 600, fontSize: 15, color: '#2563eb' }}>新しいパスワード</label>
              <input
                type={showNewPasswordField ? "text" : "password"}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #b6c6e3',
                  borderRadius: '6px',
                  marginTop: 4,
                  fontSize: 16,
                  marginBottom: 8,
                  background: '#f3f6fb',
                  color: '#1e293b',
                }}
                placeholder="新しいパスワードを入力"
                autoComplete="new-password"
              />
              <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
                <input
                  type="checkbox"
                  id="showNewPassword"
                  checked={showNewPasswordField}
                  onChange={e => setShowNewPasswordField(e.target.checked)}
                  style={{ marginRight: 8 }}
                />
                <label htmlFor="showNewPassword" style={{ fontSize: 14, color: '#64748b', cursor: 'pointer' }}>
                  パスワードを表示
                </label>
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={{ width: '100%', marginBottom: 16 }}>
              <label style={{ fontWeight: 600, fontSize: 15, color: '#2563eb' }}>メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #b6c6e3',
                  borderRadius: '6px',
                  marginTop: 4,
                  fontSize: 16,
                  marginBottom: 8,
                  background: '#f3f6fb',
                  color: '#1e293b',
                }}
                placeholder="メールアドレスを入力"
                autoComplete="username"
              />
            </div>
            <div style={{ width: '100%', marginBottom: 16 }}>
              <label style={{ fontWeight: 600, fontSize: 15, color: '#2563eb' }}>パスワード</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #b6c6e3',
                  borderRadius: '6px',
                  marginTop: 4,
                  fontSize: 16,
                  marginBottom: 8,
                  background: '#f3f6fb',
                  color: '#1e293b',
                }}
                placeholder="パスワードを入力"
                autoComplete="current-password"
              />
              <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
                <input
                  type="checkbox"
                  id="showPassword"
                  checked={showPassword}
                  onChange={e => setShowPassword(e.target.checked)}
                  style={{ marginRight: 8 }}
                />
                <label htmlFor="showPassword" style={{ fontSize: 14, color: '#64748b', cursor: 'pointer' }}>
                  パスワードを表示
                </label>
              </div>
            </div>
          </>
        )}
        {error && <div style={{ color: '#2563eb', marginBottom: 10, fontWeight: 600 }}>{error}</div>}
        <button
          type="submit"
          className="login-button"
          style={{
            width: '100%',
            padding: '13px',
            background: 'linear-gradient(90deg, #2563eb 0%, #1e40af 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '17px',
            fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '8px',
            boxShadow: '0 2px 8px rgba(37,99,235,0.08)',
            letterSpacing: 1,
            opacity: loading ? 0.6 : 1,
            transition: 'background-color 0.3s',
          }}
          disabled={loading}
        >
          {loading 
            ? (showNewPassword ? '変更中...' : 'ログイン中...') 
            : (showNewPassword ? 'パスワード変更' : 'ログイン')
          }
        </button>
        
        {/* 切り替えボタン・パスワード再設定UIを削除 */}
        
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          {/* デバッグ情報（User Pool ID）も削除 */}
        </div>
      </form>
    </div>
  );
};

export default Login; 