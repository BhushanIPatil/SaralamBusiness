export default function SectionHeader({ title, meta, action }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 600 }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {meta ? (
          <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{meta}</span>
        ) : null}
        {action}
      </div>
    </div>
  );
}
