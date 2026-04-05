import Avatar from '../ui/Avatar';

const myAccountItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'my-services', label: 'My Services', icon: '🧩' },
  { id: 'calendar', label: 'Calendar', icon: '📅' },
  { id: 'explore', label: 'Explore', icon: '🧭' },
  { id: 'latest', label: 'Latest', icon: '🔔', showDot: true },
];

const providerItems = [
  { id: 'provider-dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'manage-bookings', label: 'Manage Bookings', icon: '📋' },
  { id: 'customers', label: 'Customers', icon: '👥' },
  { id: 'provider-calendar', label: 'Calendar', icon: '🗓️' },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
  { id: 'offers', label: 'Offers & Posts', icon: '🏷️' },
];

function NavItem({ active, icon, label, onClick, showDot }) {
  return (
    <div className={`ni ${active ? 'on' : ''}`} onClick={onClick}>
      <span>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {showDot ? <div className="ni-dot" /> : null}
    </div>
  );
}

export default function Sidebar({ app }) {
  const { page, navigate, unreadCount, currentUser, providerService } = app;

  return (
    <aside className="sidebar">
      <div className="sb-logo">
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div className="sb-mark">B</div>
          <div>
            <div className="sb-name">Booknest</div>
            <div className="sb-tag">Service Platform</div>
          </div>
        </div>
      </div>

      <div className="sb-section">
        <div className="sb-lbl">My Account</div>
        {myAccountItems.map((item) => (
          <NavItem
            key={item.id}
            active={page === item.id}
            icon={item.icon}
            label={item.label}
            showDot={item.showDot && unreadCount > 0}
            onClick={() => navigate(item.id)}
          />
        ))}
      </div>

      <div className="sb-divider" />

      <div className="sb-section">
        <div className="sb-lbl">My Service</div>
        {providerService ? (
          providerItems.map((item) => (
            <NavItem
              key={item.id}
              active={page === item.id}
              icon={item.icon}
              label={item.label}
              onClick={() => navigate(item.id)}
            />
          ))
        ) : (
          <div className="sb-cta" onClick={() => navigate('onboard-service')}>
            <div className="sb-cta-t">+ Onboard your service</div>
            <div className="sb-cta-s">Start accepting bookings</div>
          </div>
        )}
      </div>

      <div className="sb-user" onClick={() => navigate('profile')}>
        <Avatar user={currentUser} size={26} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {currentUser.display_name}
          </div>
          <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>
            @{currentUser.handle}
          </div>
        </div>
      </div>
    </aside>
  );
}
