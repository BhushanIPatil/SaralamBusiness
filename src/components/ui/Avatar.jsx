import { avatarColor, getInitials } from '../../utils/formatters';

export function Avatar({ user, size = 28 }) {
  if (!user) return null;

  const name = user.display_name || user.name || 'User';
  const seed = user.handle || name;
  const color = avatarColor(seed);

  return (
    <div
      className="av"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}22, rgba(255,255,255,.9))`,
        border: `1.5px solid ${color}44`,
        color,
        fontSize: Math.floor(size * 0.38),
        boxShadow: `0 10px 22px ${color}1f, inset 0 1px 0 rgba(255,255,255,.85)`,
        backdropFilter: 'blur(10px)',
      }}
    >
      {getInitials(name)}
    </div>
  );
}

export function AvatarInfo({ user, size = 28, subtitle }) {
  if (!user) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Avatar user={user} size={size} />
      <div>
        <div style={{ fontSize: 12, fontWeight: 700 }}>{user.display_name || user.name}</div>
        <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>
          {subtitle || `@${user.handle}`}
        </div>
      </div>
    </div>
  );
}

export default Avatar;
