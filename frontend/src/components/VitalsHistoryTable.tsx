import type { VitalLog } from '../types';

interface VitalsHistoryTableProps {
  logs: VitalLog[];
  deletingId: string | null;
  onEdit: (log: VitalLog) => void;
  onDelete: (id: string) => void;
}

function valueOrDash(value: number | null | undefined) {
  return typeof value === 'number' ? value : '-';
}

function formatBloodPressure(log: VitalLog) {
  if (typeof log.bloodPressureSystolic !== 'number' && typeof log.bloodPressureDiastolic !== 'number') {
    return '-';
  }
  return `${valueOrDash(log.bloodPressureSystolic)}/${valueOrDash(log.bloodPressureDiastolic)}`;
}

function formatSugar(log: VitalLog) {
  const fasting = valueOrDash(log.bloodSugarFasting);
  const random = valueOrDash(log.bloodSugarRandom);

  if (fasting === '-' && random === '-') {
    return '-';
  }

  return `F:${fasting} / R:${random}`;
}

export default function VitalsHistoryTable({ logs, deletingId, onEdit, onDelete }: VitalsHistoryTableProps) {
  return (
    <div className="card">
      <p className="card-title">Vitals History</p>

      {logs.length === 0 ? (
        <p className="no-data">No vitals logs yet. Add your first entry above.</p>
      ) : (
        <div className="analytics-table-wrap">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Weight</th>
                <th>BMI</th>
                <th>BP</th>
                <th>Sugar</th>
                <th>Sleep</th>
                <th>Steps</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id}>
                  <td>{new Date(log.date).toLocaleDateString()}</td>
                  <td>{valueOrDash(log.weight)}</td>
                  <td>{valueOrDash(log.bmi)}</td>
                  <td>{formatBloodPressure(log)}</td>
                  <td>{formatSugar(log)}</td>
                  <td>{valueOrDash(log.sleepHours)}</td>
                  <td>{valueOrDash(log.steps)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button className="btn-link" onClick={() => onEdit(log)}>
                        Edit
                      </button>
                      <button
                        className="btn-sm btn-danger"
                        onClick={() => onDelete(log._id)}
                        disabled={deletingId === log._id}
                      >
                        {deletingId === log._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
