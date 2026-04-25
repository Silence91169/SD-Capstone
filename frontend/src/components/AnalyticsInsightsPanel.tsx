import type { ReportSignal } from '../types';

interface AnalyticsInsightsPanelProps {
  insights: string[];
  recommendations: string[];
  reportSignals: ReportSignal[];
}

export default function AnalyticsInsightsPanel({
  insights,
  recommendations,
  reportSignals,
}: AnalyticsInsightsPanelProps) {
  return (
    <div className="card">
      <p className="card-title">Insights Panel</p>

      <div className="analytics-insights-columns">
        <div>
          <p className="analytics-section-label">Readable Summary</p>
          {insights.length === 0 ? (
            <p className="no-data" style={{ textAlign: 'left', padding: 0 }}>No summary available yet.</p>
          ) : (
            <ul className="records-list">
              {insights.map((item) => (
                <li key={item} className="record-item" style={{ alignItems: 'flex-start' }}>
                  <div className="record-info">
                    <strong>Insight</strong>
                    <span>{item}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <p className="analytics-section-label">Recommendations</p>
          {recommendations.length === 0 ? (
            <p className="no-data" style={{ textAlign: 'left', padding: 0 }}>No recommendations yet.</p>
          ) : (
            <ul className="records-list">
              {recommendations.map((item) => (
                <li key={item} className="record-item" style={{ alignItems: 'flex-start' }}>
                  <div className="record-info">
                    <strong>Suggestion</strong>
                    <span>{item}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <p className="analytics-section-label">Report Signals</p>
        {reportSignals.length === 0 ? (
          <p className="no-data" style={{ textAlign: 'left', padding: 0 }}>
            No report signals detected from uploaded medical reports yet.
          </p>
        ) : (
          <ul className="records-list">
            {reportSignals.map((signal) => (
              <li key={signal.key} className="record-item" style={{ alignItems: 'flex-start' }}>
                <div className="record-info">
                  <strong>{signal.title}</strong>
                  {signal.recommendation && <span>{signal.recommendation}</span>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
