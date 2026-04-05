export default function EmptyState({ icon = '📦', title, description }) {
  return (
    <div className="empty">
      <div className="empty-ic">{icon}</div>
      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{title}</div>
      {description ? (
        <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{description}</div>
      ) : null}
    </div>
  );
}
