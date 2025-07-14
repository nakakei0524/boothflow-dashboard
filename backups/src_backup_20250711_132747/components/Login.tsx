import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../index.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [companyId, setCompanyId] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const { login, signUp, confirmSignUp, forgotPassword, confirmForgotPassword } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (error: any) {
      setError(error.message || 'ログインに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await signUp(email, password, companyId);
      setIsConfirming(true);
    } catch (error: any) {
      setError(error.message || 'サインアップに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await confirmSignUp(email, confirmationCode);
      setIsConfirming(false);
      setIsSignUp(false);
      setError('アカウントが確認されました。ログインしてください。');
    } catch (error: any) {
      setError(error.message || '確認コードの確認に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await forgotPassword(email);
      setError('パスワードリセット用のコードをメールで送信しました。');
    } catch (error: any) {
      setError(error.message || 'パスワードリセットに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await confirmForgotPassword(email, confirmationCode, newPassword);
      setIsForgotPassword(false);
      setError('パスワードが更新されました。新しいパスワードでログインしてください。');
    } catch (error: any) {
      setError(error.message || 'パスワード更新に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  if (isConfirming) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h2>アカウント確認</h2>
          <p>メールに送信された確認コードを入力してください</p>
          <form onSubmit={handleConfirmSignUp}>
            <div className="form-group">
              <label>確認コード</label>
              <input
                type="text"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? '確認中...' : '確認'}
            </button>
          </form>
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    );
  }

  if (isForgotPassword) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h2>パスワードリセット</h2>
          <form onSubmit={handleForgotPassword}>
            <div className="form-group">
              <label>メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? '送信中...' : 'リセットコードを送信'}
            </button>
          </form>
          {error && <p className="error">{error}</p>}
          <button 
            type="button" 
            onClick={() => setIsForgotPassword(false)}
            className="back-button"
          >
            ログインに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isSignUp ? 'アカウント作成' : 'ログイン'}</h2>
        
        {isSignUp ? (
          <form onSubmit={handleSignUp}>
            <div className="form-group">
              <label>メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>パスワード</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <div className="form-group">
              <label>会社ID</label>
              <input
                type="text"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                required
                placeholder="例: memori.inc"
              />
            </div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? '作成中...' : 'アカウント作成'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>パスワード</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>
        )}

        {error && <p className="error">{error}</p>}

        <div className="login-links">
          {!isSignUp && (
            <>
              <button 
                type="button" 
                onClick={() => setIsSignUp(true)}
                className="link-button"
              >
                アカウントを作成
              </button>
              <button 
                type="button" 
                onClick={() => setIsForgotPassword(true)}
                className="link-button"
              >
                パスワードを忘れた場合
              </button>
            </>
          )}
          {isSignUp && (
            <button 
              type="button" 
              onClick={() => setIsSignUp(false)}
              className="link-button"
            >
              ログインに戻る
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login; 