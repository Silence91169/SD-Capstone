import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { AnalyticsChartsData } from '../types';

interface AnalyticsChartsProps {
  chartsData: AnalyticsChartsData;
}

interface ChartCardProps {
  title: string;
  hasData: boolean;
  children: React.ReactNode;
}

function ChartCard({ title, hasData, children }: ChartCardProps) {
  return (
    <div className="card analytics-chart-card">
      <p className="card-title">{title}</p>
      {!hasData ? <p className="no-data" style={{ padding: 24 }}>Not enough data yet.</p> : children}
    </div>
  );
}

export default function AnalyticsCharts({ chartsData }: AnalyticsChartsProps) {
  return (
    <div className="analytics-charts-grid">
      <ChartCard title="Weight Trend" hasData={chartsData.weight.length > 0}>
        <div className="analytics-chart-container">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartsData.weight}>
              <CartesianGrid strokeDasharray="4 4" stroke="#ebe7f7" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="weight" stroke="#f97316" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Blood Pressure Trend" hasData={chartsData.bloodPressure.length > 0}>
        <div className="analytics-chart-container">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartsData.bloodPressure}>
              <CartesianGrid strokeDasharray="4 4" stroke="#ebe7f7" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="systolic" stroke="#ef4444" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="diastolic" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Blood Sugar Trend" hasData={chartsData.sugar.length > 0}>
        <div className="analytics-chart-container">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartsData.sugar}>
              <CartesianGrid strokeDasharray="4 4" stroke="#ebe7f7" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="fasting" stroke="#6366f1" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="random" stroke="#8b5cf6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Sleep Trend" hasData={chartsData.sleep.length > 0}>
        <div className="analytics-chart-container">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartsData.sleep}>
              <CartesianGrid strokeDasharray="4 4" stroke="#ebe7f7" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sleepHours" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
}
