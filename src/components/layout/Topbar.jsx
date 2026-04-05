import Avatar from '../ui/Avatar';

const titles = {
  dashboard: 'Dashboard',
  'my-services': 'My Services',
  'service-detail': 'Service Detail',
  calendar: 'My Calendar',
  explore: 'Explore Services',
  latest: 'Latest',
  'provider-dashboard': 'Provider Dashboard',
  'manage-bookings': 'Manage Bookings',
  customers: 'Customers',
  'provider-calendar': 'Provider Calendar',
  analytics: 'Analytics',
  offers: 'Offers & Posts',
  'onboard-service': 'Onboard Service',
  profile: 'My Profile',
};

const providerPages = new Set([
  'provider-dashboard',
  'manage-bookings',
  'customers',
  'provider-calendar',
  'analytics',
  'offers',
]);

export default function Topbar({ app }) {
  const { page, navigate, currentUser, unreadCount } = app;
  const showProviderAction = providerPages.has(page);

  return (
    <header className="topbar">
      <div className="tb-title">{titles[page] || 'Booknest'}</div>

      {showProviderAction ? (
        <button className="tb-btn" onClick={() => navigate('manage-bookings')}>
          📋 Manage bookings
        </button>
      ) : page !== 'latest' ? (
        <button className="tb-btn" onClick={() => navigate('explore')}>
          🧭 Explore services
        </button>
      ) : null}

      <div className="tb-iBtn" onClick={() => navigate('latest')}>
        🔔
        {unreadCount > 0 ? <div className="nb-dot" /> : null}
      </div>

      <div style={{ cursor: 'pointer' }} onClick={() => navigate('profile')}>
        <Avatar user={currentUser} size={28} />
      </div>
    </header>
  );
}
