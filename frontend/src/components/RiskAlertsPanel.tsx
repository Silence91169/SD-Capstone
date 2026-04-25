import type { RiskIndicator } from '../types';

interface RiskAlertsPanelProps {
  indicators: RiskIndicator[];
  riskFlags: string[];
}

function severityClass(severity: RiskIndicator['severity']) {
  if (severity === 'good') {
    return 'analytics-risk-good';
  }
  if (severity === 'warning') {
    return 'analytics-risk-warning';
  }
  return 'analytics-risk-neutral';
}

export default function RiskAlertsPanel({ indicators, riskFlags }: RiskAlertsPanelProps) {
  return (
    <div className="card">
      <p className="card-title">Risk Alerts</p>

      <div className="analytics-risk-grid">
        {indicators.map((indicator) => (
          <div key={indicator.key} className={`analytics-risk-card ${severityClass(indicator.severity)}`}>
            <span>{indicator.title}</span>
            <strong>{indicator.status}</strong>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14 }}>
        {riskFlags.length === 0 ? (
          <p className="no-data" style={{ padding: 18 }}>No major risk flags detected.</p>
        ) : (
          <ul className="records-list">
            {riskFlags.map((flag) => (
              <li key={flag} className="record-item" style={{ alignItems: 'flex-start' }}>
                <div className="record-info">
                  <strong>Indicator</strong>
                  <span>{flag}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
