interface EmergencyQRCodeCardProps {
  qrDataUrl: string;
  publicUrl: string;
  accessEnabled: boolean;
  generating: boolean;
  regenerating: boolean;
  onDownload: () => void;
  onRegenerate: () => void;
  onPreview: () => void;
}

export default function EmergencyQRCodeCard({
  qrDataUrl,
  publicUrl,
  accessEnabled,
  generating,
  regenerating,
  onDownload,
  onRegenerate,
  onPreview,
}: EmergencyQRCodeCardProps) {
  return (
    <div className="card">
      <p className="card-title">Emergency QR Code</p>

      <div className="qr-wrapper">
        {generating ? (
          <p className="no-data" style={{ padding: 0 }}>Generating QR code...</p>
        ) : qrDataUrl ? (
          <img src={qrDataUrl} alt="Emergency access QR code" className="qr-image" />
        ) : (
          <p className="no-data" style={{ padding: 0 }}>QR code unavailable.</p>
        )}
      </div>

      <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 12 }}>
        Public access is currently <strong>{accessEnabled ? 'enabled' : 'disabled'}</strong>.
      </p>

      {publicUrl && (
        <p
          style={{
            color: 'var(--muted)',
            fontSize: 12,
            lineHeight: 1.5,
            marginBottom: 14,
            wordBreak: 'break-all',
          }}
        >
          {publicUrl}
        </p>
      )}

      <div className="qr-actions">
        <button className="btn-outline" type="button" onClick={onDownload} disabled={!qrDataUrl}>
          Download QR
        </button>
        <button className="btn-link" type="button" onClick={onRegenerate} disabled={regenerating}>
          {regenerating ? 'Regenerating...' : 'Regenerate QR'}
        </button>
        <button className="btn-link" type="button" onClick={onPreview} disabled={!publicUrl}>
          Preview Public Page
        </button>
      </div>
    </div>
  );
}
