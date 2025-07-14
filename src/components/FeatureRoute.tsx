import React from 'react';
import { useCompany } from '../contexts/CompanyContext';

interface FeatureRouteProps {
  feature: 'realtimeDashboard' | 'searchDashboard' | 'visitorPanel' | 'customReports';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const FeatureRoute: React.FC<FeatureRouteProps> = ({ feature, children, fallback }): React.ReactElement => {
  const { currentCompany } = useCompany();

  if (!currentCompany?.features[feature]) {
    return (
      <div className="feature-not-available">
        <h2>この機能は利用できません</h2>
        <p>お客様のプランではこの機能が含まれていません。</p>
        <p>プランのアップグレードをご検討ください。</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default FeatureRoute; 