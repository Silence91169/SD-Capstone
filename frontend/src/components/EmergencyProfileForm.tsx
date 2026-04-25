import type { EmergencyContact, EmergencyProfileData } from '../types';

interface EmergencyProfileFormProps {
  profile: EmergencyProfileData;
  saving: boolean;
  onChange: (nextProfile: EmergencyProfileData) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

function parseCsvList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function toCsvList(values: string[]): string {
  return values.join(', ');
}

export default function EmergencyProfileForm({ profile, saving, onChange, onSubmit }: EmergencyProfileFormProps) {
  const updateField = <K extends keyof EmergencyProfileData>(key: K, value: EmergencyProfileData[K]) => {
    onChange({ ...profile, [key]: value });
  };

  const updateContact = (index: number, key: keyof EmergencyContact, value: string) => {
    const nextContacts = [...profile.emergencyContacts];
    nextContacts[index] = { ...nextContacts[index], [key]: value };
    updateField('emergencyContacts', nextContacts);
  };

  const addContact = () => {
    if (profile.emergencyContacts.length >= 5) {
      return;
    }
    updateField('emergencyContacts', [
      ...profile.emergencyContacts,
      { name: '', relation: '', phone: '' },
    ]);
  };

  const removeContact = (index: number) => {
    const nextContacts = profile.emergencyContacts.filter((_, contactIndex) => contactIndex !== index);
    updateField('emergencyContacts', nextContacts);
  };

  return (
    <form onSubmit={onSubmit} className="upload-form">
      <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          value={profile.fullName}
          onChange={(event) => updateField('fullName', event.target.value)}
          placeholder="e.g. John Doe"
          maxLength={120}
          required
        />
      </div>

      <div className="form-group">
        <label>Age</label>
        <input
          type="number"
          value={profile.age ?? ''}
          min={0}
          max={130}
          onChange={(event) => {
            const value = event.target.value;
            updateField('age', value === '' ? null : Number(value));
          }}
          placeholder="e.g. 42"
        />
      </div>

      <div className="form-group">
        <label>Blood Group</label>
        <input
          type="text"
          value={profile.bloodGroup}
          onChange={(event) => updateField('bloodGroup', event.target.value.toUpperCase())}
          placeholder="e.g. O+"
          maxLength={10}
        />
      </div>

      <div className="form-group">
        <label>Allergies</label>
        <input
          type="text"
          value={toCsvList(profile.allergies)}
          onChange={(event) => updateField('allergies', parseCsvList(event.target.value))}
          placeholder="Comma separated, e.g. Penicillin, Peanuts"
        />
      </div>

      <div className="form-group">
        <label>Conditions</label>
        <input
          type="text"
          value={toCsvList(profile.conditions)}
          onChange={(event) => updateField('conditions', parseCsvList(event.target.value))}
          placeholder="Comma separated, e.g. Asthma, Hypertension"
        />
      </div>

      <div className="form-group">
        <label>Medications</label>
        <input
          type="text"
          value={toCsvList(profile.medications)}
          onChange={(event) => updateField('medications', parseCsvList(event.target.value))}
          placeholder="Comma separated, e.g. Metformin 500mg"
        />
      </div>

      <div className="form-group">
        <label>Emergency Contacts</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {profile.emergencyContacts.length === 0 && (
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>
              Add at least one emergency contact if possible.
            </p>
          )}

          {profile.emergencyContacts.map((contact, index) => (
            <div key={`${index}-${contact.phone}`} className="emergency-contact-row">
              <input
                type="text"
                placeholder="Name"
                value={contact.name}
                onChange={(event) => updateContact(index, 'name', event.target.value)}
                maxLength={80}
                required
              />
              <input
                type="text"
                placeholder="Relation"
                value={contact.relation}
                onChange={(event) => updateContact(index, 'relation', event.target.value)}
                maxLength={80}
                required
              />
              <input
                type="text"
                placeholder="Phone"
                value={contact.phone}
                onChange={(event) => updateContact(index, 'phone', event.target.value)}
                maxLength={30}
                required
              />
              <button
                type="button"
                className="btn-sm btn-danger"
                onClick={() => removeContact(index)}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            className="btn-outline"
            onClick={addContact}
            disabled={profile.emergencyContacts.length >= 5}
          >
            + Add Contact
          </button>
        </div>
      </div>

      <div className="form-group">
        <label>Additional Notes</label>
        <textarea
          value={profile.notes}
          onChange={(event) => updateField('notes', event.target.value)}
          rows={4}
          placeholder="Any important emergency notes"
          maxLength={500}
        />
      </div>

      <button type="submit" className="btn-primary" disabled={saving}>
        {saving ? 'Saving...' : 'Save Emergency Profile'}
      </button>
    </form>
  );
}
