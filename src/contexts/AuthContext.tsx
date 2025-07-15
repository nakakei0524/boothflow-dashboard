import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signIn, signOut, getCurrentUser, fetchUserAttributes, signUp, confirmSignUp, resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

interface User {
  id: string;
  email: string;
  companyId: string;
  companyName: string; // companyNameを追加
  username: string;
  attributes: { [key: string]: any }; // attributesを追加
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, companyId: string) => Promise<void>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  confirmForgotPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  showAuthenticator: () => void;
  hideAuthenticator: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkAuthState();
  }, []);

  // セッションタイムアウト（30分）
  useEffect(() => {
    if (!user) return;
    let timeoutId: NodeJS.Timeout;
    let lastActivity = Date.now();
    const TIMEOUT_MINUTES = 30;
    const resetTimer = () => {
      lastActivity = Date.now();
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (Date.now() - lastActivity >= TIMEOUT_MINUTES * 60 * 1000) {
          logout();
          alert('30分間操作がなかったため自動的にログアウトしました。再度ログインしてください。');
        }
      }, TIMEOUT_MINUTES * 60 * 1000);
    };
    // 各種ユーザー操作イベントでタイマーリセット
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [user]);

  const checkAuthState = async () => {
    try {
      setIsLoading(true);
      const cognitoUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      
      // 複数の属性名でcompanyIdを探す
      const companyId = 
        attributes['custom:companyId'] || 
        attributes['custom:company_id'] || 
        attributes['company_id'] || 
        attributes['companyId'] || 
        'memori.inc';
      
      // 複数の属性名でcompanyNameを探す
      const companyName = 
        attributes['custom:company_name'] || 
        attributes['custom:cumpany_name'] || 
        attributes['custom:companyName'] || 
        attributes['company_name'] || 
        attributes['companyName'] || 
        'Company Name';
      
      setUser({
        id: cognitoUser.username,
        email: attributes.email || '',
        companyId: companyId,
        companyName: companyName,
        username: cognitoUser.username,
        attributes,
      });
    } catch (error: any) {
      if (error.name === 'NotAuthorizedException') {
        setUser(null);
        await signOut();
        alert('セッションの有効期限が切れました。再度ログインしてください。');
      } else {
        setUser(null);
      }
    } finally {
      setIsLoading(false);
      setAuthChecked(true);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // 既存セッションを確実にクリア
      try {
        const currentUser = await getCurrentUser();
        console.log('既存ユーザーを検出（AuthContext）:', currentUser.username);
        await signOut();
        console.log('既存セッションをクリアしました（AuthContext）');
        // 少し待機してから次の処理へ
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.log('既存セッションなし、またはクリア済み（AuthContext）');
      }
      
      const { isSignedIn } = await signIn({ username: email, password });
      if (isSignedIn) {
        await checkAuthState();
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await signOut();
      setUser(null);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUpUser = async (email: string, password: string, companyId: string) => {
    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            'custom:companyId': companyId,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  };

  const confirmSignUpUser = async (email: string, code: string) => {
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
    } catch (error) {
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await resetPassword({ username: email });
    } catch (error) {
      throw error;
    }
  };

  const confirmForgotPassword = async (email: string, code: string, newPassword: string) => {
    try {
      await confirmResetPassword({ username: email, confirmationCode: code, newPassword });
    } catch (error) {
      throw error;
    }
  };

  const showAuthenticator = () => setShowAuth(true);
  const hideAuthenticator = () => setShowAuth(false);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    signUp: signUpUser,
    confirmSignUp: confirmSignUpUser,
    forgotPassword,
    confirmForgotPassword,
    showAuthenticator,
    hideAuthenticator,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {showAuth && (
        <div className="auth-modal-overlay">
          <div className="auth-modal">
            <button className="auth-modal-close" onClick={hideAuthenticator}>×</button>
            <Authenticator />
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}; 