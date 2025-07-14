// src/components/RealtimeSearchBar.tsx
import React, { useState } from "react";

interface Props {
  sessionId: string;
  baseDate: string;
  onSessionChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onSave: () => void;
  onStartMeasurement: () => void;
  onStopMeasurement: () => void;
}

const RealtimeSearchBar: React.FC<Props> = ({
  sessionId,
  baseDate,
  onSessionChange,
  onDateChange,
  onSave,
  onStartMeasurement,
  onStopMeasurement,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [lineConfigured, setLineConfigured] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // 無効時の色を統一
  const DISABLED_COLOR = '#6c757d';
  const DISABLED_OPACITY = 0.6;

  const handleSave = () => {
    if (!sessionId || !baseDate) {
      alert("会期名と日付を入力してください");
      return;
    }
    setIsSaved(true);
    onSave();
  };

  const handleLineConfiguration = () => {
    if (!sessionId || !baseDate) {
      alert("会期名と日付を入力してください");
      return;
    }
    if (!isSaved) {
      alert("先に保存を行ってください");
      return;
    }
    setLineConfigured(true);
    setCurrentStep(1);
    alert('判定ライン設定完了');
  };

  const handleStartMeasurement = () => {
    if (!sessionId || !baseDate) {
      alert("会期名と日付を入力してください");
      return;
    }
    if (!isSaved) {
      alert("先に保存を行ってください");
      return;
    }
    if (!lineConfigured) {
      alert("先に判定ライン設定を行ってください（Step1）");
      return;
    }
    setCurrentStep(2);
    onStartMeasurement();
  };

  const handleStopMeasurement = () => {
    if (!sessionId || !baseDate) {
      alert("会期名と日付を入力してください");
      return;
    }
    if (!isSaved) {
      alert("先に保存を行ってください");
      return;
    }
    if (!lineConfigured) {
      alert("先に判定ライン設定を行ってください（Step1）");
      return;
    }
    if (currentStep < 2) {
      alert("先に計測開始を行ってください（Step2）");
      return;
    }
    setCurrentStep(3);
    onStopMeasurement();
  };

  const handleVideoCheck = () => {
    if (!sessionId || !baseDate) {
      alert("会期名と日付を入力してください");
      return;
    }
    if (!isSaved) {
      alert("先に保存を行ってください");
      return;
    }
    if (!lineConfigured) {
      alert("先に判定ライン設定を行ってください（Step1）");
      return;
    }
    alert('映像確認');
  };

  // ボタンの無効状態を判定する関数
  const isLineConfigDisabled = !sessionId || !baseDate || !isSaved;
  const isStartDisabled = !sessionId || !baseDate || !isSaved || !lineConfigured;
  const isStopDisabled = !sessionId || !baseDate || !isSaved || !lineConfigured || currentStep < 2;
  const isVideoCheckDisabled = !sessionId || !baseDate || !isSaved || !lineConfigured;

  return (
    <div className="header-container" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      width: '100%'
    }}>
      <div className="search-bar compact" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        flexWrap: 'wrap',
        padding: '16px 20px',
        background: '#f8f9fa',
        borderRadius: '12px',
        border: '1px solid #e9ecef',
        justifyContent: 'center',
        maxWidth: '1200px',
        width: '100%'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontWeight: 600, fontSize: 14, color: '#495057', minWidth: '60px' }}>会期名：</label>
          <input
            type="text"
            placeholder="キーワード"
            className="search-input"
            value={sessionId}
            onChange={(e) => onSessionChange(e.target.value)}
            style={{ 
              padding: '8px 12px',
              border: '1px solid #ced4da',
              borderRadius: '6px',
              fontSize: 14,
              minWidth: '120px'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontWeight: 600, fontSize: 14, color: '#495057', minWidth: '40px' }}>日付：</label>
          <input
            type="date"
            className="date-input"
            value={baseDate}
            onChange={(e) => onDateChange(e.target.value)}
            style={{ 
              padding: '8px 12px',
              border: '1px solid #ced4da',
              borderRadius: '6px',
              fontSize: 14
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            className="search-button" 
            onClick={handleSave}
            style={{
              padding: '8px 16px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#218838'}
            onMouseOut={(e) => e.currentTarget.style.background = '#28a745'}
          >
            保存
          </button>
        </div>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px',
          marginLeft: '24px',
          paddingLeft: '24px',
          borderLeft: '2px solid #dee2e6'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{ 
              fontSize: '11px', 
              fontWeight: '600', 
              color: lineConfigured ? '#28a745' : '#6c757d',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Step 1
            </div>
            <button
              className="line-config-btn"
              disabled={isLineConfigDisabled}
              onClick={handleLineConfiguration}
              style={{
                padding: '10px 18px',
                background: isLineConfigDisabled ? DISABLED_COLOR : (lineConfigured ? '#28a745' : '#17a2b8'),
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: 14,
                fontWeight: 600,
                cursor: isLineConfigDisabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: isLineConfigDisabled ? DISABLED_OPACITY : 1,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                minWidth: '120px'
              }}
              onMouseOver={(e) => {
                if (!isLineConfigDisabled && !lineConfigured) {
                  e.currentTarget.style.background = '#138496';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                }
              }}
              onMouseOut={(e) => {
                if (!isLineConfigDisabled && !lineConfigured) {
                  e.currentTarget.style.background = '#17a2b8';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }
              }}
            >
              {lineConfigured ? '✓ 設定済み' : '判定ライン設定'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{ 
              fontSize: '11px', 
              fontWeight: '600', 
              color: currentStep >= 2 ? '#28a745' : '#6c757d',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Step 2
            </div>
            <button
              className="measure-btn start"
              disabled={isStartDisabled}
              onClick={handleStartMeasurement}
              style={{
                padding: '10px 18px',
                background: isStartDisabled ? DISABLED_COLOR : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: 14,
                fontWeight: 600,
                cursor: isStartDisabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: isStartDisabled ? DISABLED_OPACITY : 1,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                minWidth: '120px'
              }}
              onMouseOver={(e) => {
                if (!isStartDisabled) {
                  e.currentTarget.style.background = '#0056b3';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                }
              }}
              onMouseOut={(e) => {
                if (!isStartDisabled) {
                  e.currentTarget.style.background = '#007bff';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }
              }}
            >
              計測開始
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{ 
              fontSize: '11px', 
              fontWeight: '600', 
              color: currentStep >= 3 ? '#28a745' : '#6c757d',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Step 3
            </div>
            <button
              className="measure-btn stop"
              disabled={isStopDisabled}
              onClick={handleStopMeasurement}
              style={{
                padding: '10px 18px',
                background: isStopDisabled ? DISABLED_COLOR : '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: 14,
                fontWeight: 600,
                cursor: isStopDisabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: isStopDisabled ? DISABLED_OPACITY : 1,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                minWidth: '120px'
              }}
              onMouseOver={(e) => {
                if (!isStopDisabled) {
                  e.currentTarget.style.background = '#c82333';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                }
              }}
              onMouseOut={(e) => {
                if (!isStopDisabled) {
                  e.currentTarget.style.background = '#dc3545';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }
              }}
            >
              計測終了
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{ 
              fontSize: '11px', 
              fontWeight: '600', 
              color: '#6c757d',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              映像
            </div>
            <button
              className="video-check-btn"
              disabled={isVideoCheckDisabled}
              onClick={handleVideoCheck}
              style={{
                padding: '10px 18px',
                background: isVideoCheckDisabled ? DISABLED_COLOR : '#6f42c1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: 14,
                fontWeight: 600,
                cursor: isVideoCheckDisabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: isVideoCheckDisabled ? DISABLED_OPACITY : 1,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                minWidth: '120px'
              }}
              onMouseOver={(e) => {
                if (!isVideoCheckDisabled) {
                  e.currentTarget.style.background = '#5a32a3';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                }
              }}
              onMouseOut={(e) => {
                if (!isVideoCheckDisabled) {
                  e.currentTarget.style.background = '#6f42c1';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }
              }}
            >
              映像確認
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeSearchBar;
