import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useCompany } from '../contexts/CompanyContext';

interface SavedSession {
  session_id: string;
  base_date: string;
  company_id: string;
  total_visitors: number;
  contacted_count: number;
  lost_count: number;
  passed_count: number;
  contact_rate: number;
  created_at: string;
}

interface SavedSessionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSession: (sessionId: string, baseDate: string) => void;
}

const SavedSessionsModal: React.FC<SavedSessionsModalProps> = ({
  isOpen,
  onClose,
  onSelectSession,
}) => {
  const { user } = useAuth();
  const { currentCompany } = useCompany();
  const [sessions, setSessions] = useState<SavedSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSavedSessions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const companyId = user?.companyId || currentCompany?.companyId || "memori.inc";
      
      console.log('=== Fetching Saved Sessions ===');
      console.log('Company ID:', companyId);
      console.log('API Endpoint:', `${currentCompany?.apiEndpoints.baseUrl}/${currentCompany?.apiEndpoints.getSavedSessions}`);

      // session_dbからデータを取得
      console.log('Fetching from session_db...');
      
      try {
        // まずsession_dbからセッション一覧を取得
        const sessionDbResponse = await axios.get(
          `${currentCompany?.apiEndpoints.baseUrl}/${currentCompany?.apiEndpoints.getSessionDb}`,
          {
            params: {
              company_id: companyId,
            },
          }
        );

        console.log('Session DB response:', sessionDbResponse.data);

        if (sessionDbResponse.data && sessionDbResponse.data.sessions) {
          // session_dbから取得したデータを変換
          const sessionData = sessionDbResponse.data.sessions.map((session: any) => ({
            session_id: session.session_id || session.id,
            base_date: session.base_date || session.date,
            company_id: session.company_id || companyId,
            total_visitors: session.total_visitors || 0,
            contacted_count: session.contacted_count || 0,
            lost_count: session.lost_count || 0,
            passed_count: session.passed_count || 0,
            contact_rate: session.contact_rate || 0,
            created_at: session.created_at || session.timestamp || new Date().toISOString()
          }));

          setSessions(sessionData);
        } else {
          // session_dbにデータがない場合、モックデータを使用
          console.log('No data in session_db, using mock data');
          setSessions([
            {
              session_id: 'demo-session-1',
              base_date: '2024-01-15',
              company_id: companyId,
              total_visitors: 150,
              contacted_count: 45,
              lost_count: 30,
              passed_count: 75,
              contact_rate: 30.0,
              created_at: '2024-01-15T10:00:00Z'
            },
            {
              session_id: 'demo-session-2',
              base_date: '2024-01-16',
              company_id: companyId,
              total_visitors: 200,
              contacted_count: 60,
              lost_count: 40,
              passed_count: 100,
              contact_rate: 30.0,
              created_at: '2024-01-16T10:00:00Z'
            }
          ]);
        }
      } catch (sessionDbError) {
        console.error('Session DB error:', sessionDbError);
        // session_dbエラーの場合、モックデータを使用
        setSessions([
          {
            session_id: 'demo-session-1',
            base_date: '2024-01-15',
            company_id: companyId,
            total_visitors: 150,
            contacted_count: 45,
            lost_count: 30,
            passed_count: 75,
            contact_rate: 30.0,
            created_at: '2024-01-15T10:00:00Z'
          },
          {
            session_id: 'demo-session-2',
            base_date: '2024-01-16',
            company_id: companyId,
            total_visitors: 200,
            contacted_count: 60,
            lost_count: 40,
            passed_count: 100,
            contact_rate: 30.0,
            created_at: '2024-01-16T10:00:00Z'
          }
        ]);
      }
    } catch (err: any) {
      console.error("保存されたセッション取得エラー:", err);
      if (err.response) {
        if (err.response.status === 401) {
          setError('認証エラーです。ログインし直してください。');
        } else if (err.response.status === 403) {
          setError('アクセス権限がありません。');
        } else if (err.response.status === 404) {
          setError('保存されたデータが見つかりません。');
        } else if (err.response.status >= 500) {
          setError('サーバーエラーが発生しました。しばらく時間をおいてから再試行してください。');
        } else {
          setError(`APIエラー: ${err.response.data?.message || err.response.statusText}`);
        }
      } else if (err.request) {
        setError('ネットワークエラーが発生しました。インターネット接続をご確認ください。');
      } else {
        setError(err.message || 'データ取得に失敗しました');
      }
    } finally {
      setLoading(false);
    }
  }, [user?.companyId, currentCompany]);

  useEffect(() => {
    if (isOpen) {
      console.log('Modal opened, fetching saved sessions...');
      fetchSavedSessions();
    }
  }, [isOpen, fetchSavedSessions]);

  const handleSessionSelect = (session: SavedSession) => {
    onSelectSession(session.session_id, session.base_date);
    onClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  console.log('SavedSessionsModal render - isOpen:', isOpen);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">保存されたデータ一覧</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="spinner" style={{ width: 40, height: 40, borderWidth: 4 }}></div>
              <span className="ml-3 text-gray-600">読み込み中...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchSavedSessions}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                再試行
              </button>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">保存されたデータがありません</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {sessions.map((session, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleSessionSelect(session)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">
                        {session.session_id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        日付: {formatDate(session.base_date)}
                      </p>
                      <p className="text-sm text-gray-500">
                        会社ID: {session.company_id}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        保存日時: {formatDateTime(session.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-blue-600 font-medium">総来場者数</p>
                      <p className="text-2xl font-bold text-blue-800">{session.total_visitors}人</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-green-600 font-medium">接触数</p>
                      <p className="text-2xl font-bold text-green-800">{session.contacted_count}人</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded">
                      <p className="text-red-600 font-medium">機会損失</p>
                      <p className="text-2xl font-bold text-red-800">{session.lost_count}人</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-gray-600 font-medium">接触率</p>
                      <p className="text-2xl font-bold text-gray-800">{session.contact_rate.toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-gray-500">
                    クリックして詳細を表示
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavedSessionsModal; 