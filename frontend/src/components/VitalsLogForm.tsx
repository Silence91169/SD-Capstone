import type { VitalsFormValues } from '../types';

interface VitalsLogFormProps {
  values: VitalsFormValues;
  saving: boolean;
  mode: 'create' | 'edit';
  onChange: (field: keyof VitalsFormValues, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancelEdit: () => void;
}

function Field({
  label,
  type = 'number',
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="form-group" style={{ marginBottom: 0 }}>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export default function VitalsLogForm({
  values,
  saving,
  mode,
  onChange,
  onSubmit,
  onCancelEdit,
}: VitalsLogFormProps) {
  return (
    <div className="card">
      <p className="card-title">{mode === 'edit' ? 'Update Vitals Log' : 'Log New Vitals'}</p>

      <form onSubmit={onSubmit} className="upload-form">
        <div className="analytics-form-grid">
          <Field label="Date" type="date" value={values.date} onChange={(value) => onChange('date', value)} />
          <Field label="Weight (kg)" value={values.weight} onChange={(value) => onChange('weight', value)} />
          <Field label="Height (cm)" value={values.height} onChange={(value) => onChange('height', value)} />
          <Field
            label="BP Systolic"
            value={values.bloodPressureSystolic}
            onChange={(value) => onChange('bloodPressureSystolic', value)}
          />
          <Field
            label="BP Diastolic"
            value={values.bloodPressureDiastolic}
            onChange={(value) => onChange('bloodPressureDiastolic', value)}
          />
          <Field
            label="Fasting Sugar"
            value={values.bloodSugarFasting}
            onChange={(value) => onChange('bloodSugarFasting', value)}
          />
          <Field
            label="Random Sugar"
            value={values.bloodSugarRandom}
            onChange={(value) => onChange('bloodSugarRandom', value)}
          />
          <Field label="Heart Rate" value={values.heartRate} onChange={(value) => onChange('heartRate', value)} />
          <Field
            label="Oxygen Level (%)"
            value={values.oxygenLevel}
            onChange={(value) => onChange('oxygenLevel', value)}
          />
          <Field
            label="Temperature (F)"
            value={values.temperature}
            onChange={(value) => onChange('temperature', value)}
          />
          <Field
            label="Sleep Hours"
            value={values.sleepHours}
            onChange={(value) => onChange('sleepHours', value)}
          />
          <Field label="Steps" value={values.steps} onChange={(value) => onChange('steps', value)} />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Notes</label>
          <textarea
            value={values.notes}
            onChange={(event) => onChange('notes', event.target.value)}
            placeholder="Optional notes about symptoms, food, or medications"
            rows={3}
          />
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : mode === 'edit' ? 'Update Vitals' : 'Save Vitals'}
          </button>

          {mode === 'edit' && (
            <button type="button" className="btn-outline" onClick={onCancelEdit}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
