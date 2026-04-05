import Avatar from './Avatar';
import { formatCurrency } from '../../utils/formatters';

export default function ServiceCard({
  service,
  isLinked,
  isOwn,
  compact = false,
  onView,
  onAdd,
}) {
  return (
    <div
      className={compact ? 'card-sm' : 'card'}
      style={{ overflow: 'hidden', cursor: 'pointer' }}
      onClick={() => onView?.(service.id)}
    >
      <div
        className="svc-cover"
        style={{
          height: compact ? 70 : 90,
          background: `linear-gradient(135deg, ${service.color}dd, ${service.color}88)`,
        }}
      >
        <span style={{ fontSize: compact ? 24 : 32 }}>{service.category?.icon || '★'}</span>
        <div className="svc-cat">{service.category?.name}</div>
      </div>

      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{service.name}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
        <Avatar user={service.owner} size={16} />
        <span style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>
          {service.owner?.display_name}
        </span>
      </div>
      <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 10 }}>
        {service.location}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '0.5px solid var(--color-border-tertiary)',
          paddingTop: 8,
          gap: 8,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700 }}>{formatCurrency(service.base_price)}</span>

        {isOwn ? (
          <span style={{ fontSize: 10, color: '#0891b2', fontWeight: 600 }}>Your service</span>
        ) : isLinked ? (
          <button
            type="button"
            className="btn-s"
            style={{ fontSize: 10, padding: '3px 8px', background: '#EAF3DE', color: '#27500A' }}
            onClick={(event) => event.stopPropagation()}
          >
            ✓ Added
          </button>
        ) : (
          <button
            type="button"
            className="btn-p"
            style={{ fontSize: 10, padding: '3px 10px' }}
            onClick={(event) => {
              event.stopPropagation();
              onAdd?.(service.id);
            }}
          >
            + Add
          </button>
        )}
      </div>
    </div>
  );
}
