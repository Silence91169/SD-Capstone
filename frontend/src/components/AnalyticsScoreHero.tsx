interface AnalyticsScoreHeroProps {
  healthScore: number;
  healthScoreBand: string;
  lastUpdated?: string | null;
  quickSummary: string;
}

export default function AnalyticsScoreHero({
  healthScore,
  healthScoreBand,
  lastUpdated,
  quickSummary,
}: AnalyticsScoreHeroProps) {
  const normalizedScore = Math.max(0, Math.min(100, Math.round(healthScore || 0)));
  const ringAngle = normalizedScore * 3.6;

  return (
    <div className="card analytics-hero-card">
      <div className="analytics-score-wrap">
        <div
          className="analytics-score-ring"
          style={{
            background: `conic-gradient(#22c55e 0deg ${ringAngle}deg, #e5e7eb ${ringAngle}deg 360deg)`,
          }}
        >
          <div className="analytics-score-core">
            <strong>{normalizedScore}</strong>
            <span>/100</span>
          </div>
        </div>

        <div className="analytics-score-meta">
          <p className="card-title" style={{ marginBottom: 10 }}>Health Score</p>
          <p className="analytics-score-band">{healthScoreBand}</p>
          <p className="analytics-summary-text">{quickSummary}</p>
          <p className="analytics-updated-text">
            Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Not available'}
          </p>
        </div>
      </div>
    </div>
  );
}
