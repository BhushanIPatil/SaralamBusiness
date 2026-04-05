import { AvatarInfo } from '../components/ui/Avatar';
import CalendarGrid from '../components/ui/CalendarGrid';
import EmptyState from '../components/ui/EmptyState';
import MetricCard from '../components/ui/MetricCard';
import SectionHeader from '../components/ui/SectionHeader';
import ServiceCard from '../components/ui/ServiceCard';
import StatusBadge from '../components/ui/StatusBadge';
import {
  formatCurrency,
  formatDate,
  formatLongDate,
  formatTime,
  getTodayKey,
  timeAgo,
} from '../utils/formatters';

function PageHeader({ title, description, action }) {
  return (
    <div className="ph">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

export function DashboardPage({ app }) {
  const { currentUser, bookings, linkedServices, notifications, unreadCount, providerService, navigate, openService } = app;
  const today = getTodayKey();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const myBookings = bookings.filter((booking) => booking.customer_user_id === currentUser.id);
  const todayBookings = myBookings.filter((booking) => booking.booking_date === today);
  const upcomingBookings = myBookings.filter((booking) => booking.booking_date >= today);
  const providerDayBookings = bookings
    .filter((booking) => booking.service_id === providerService.id && booking.booking_date === today)
    .slice(0, 4);

  return (
    <div className="page">
      <PageHeader
        title={`${greeting}, ${currentUser.display_name.split(' ')[0]} 👋`}
        description={new Date().toLocaleDateString('en-IN', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        })}
        action={
          <button className="btn-p" onClick={() => navigate('explore')}>
            🧭 Explore services
          </button>
        }
      />

      <div className="g4" style={{ marginBottom: 14 }}>
        <MetricCard label="Linked Services" value={linkedServices.length} subtext="Active" color="#2563eb" />
        <MetricCard label="Upcoming" value={upcomingBookings.length} subtext="Next 7 days" color="#059669" />
        <MetricCard label="Today (Salon)" value={providerDayBookings.length} subtext="Appointments" color="#d97706" />
        <MetricCard label="Unread" value={unreadCount} subtext="Notifications" color="#ef4444" />
      </div>

      <div className="g2" style={{ marginBottom: 14 }}>
        <div className="card">
          <SectionHeader title="My appointments today" meta={`${todayBookings.length} appts`} />
          {todayBookings.length === 0 ? (
            <EmptyState icon="📅" title="No appointments today" description="Your next booking will appear here." />
          ) : (
            todayBookings.map((booking) => (
              <div key={booking.id} className="bk-row">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{booking.service?.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>
                    {formatTime(booking.start_time)} – {formatTime(booking.end_time)} · {booking.staff_name}
                  </div>
                </div>
                <StatusBadge status={booking.status} />
              </div>
            ))
          )}
        </div>

        <div className="card">
          <SectionHeader
            title="Today's salon schedule"
            action={<button className="btn-s" onClick={() => navigate('provider-dashboard')}>View all</button>}
          />
          {providerDayBookings.length === 0 ? (
            <EmptyState icon="💈" title="No salon bookings today" description="Fresh slots are open." />
          ) : (
            providerDayBookings.map((booking) => (
              <div key={booking.id} className="bk-row">
                <AvatarInfo user={booking.customer_user || { display_name: booking.customer_name, handle: booking.customer_handle || 'walkin' }} size={26} />
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: 11, fontWeight: 600 }}>{formatCurrency(booking.amount)}</div>
                  <StatusBadge status={booking.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <SectionHeader
          title="My linked services"
          action={<button className="btn-s" onClick={() => navigate('my-services')}>See all</button>}
        />
        <div className="g3">
          {linkedServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              isLinked
              compact
              onView={openService}
            />
          ))}
        </div>
      </div>

      <div className="card">
        <SectionHeader
          title="Latest updates"
          action={<button className="btn-s" onClick={() => navigate('latest')}>See all</button>}
        />
        {notifications.slice(0, 4).map((item) => (
          <div key={item.id} style={{ display: 'flex', gap: 8, padding: '8px 0', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: item.is_read ? 'var(--color-border-secondary)' : '#2563eb',
                marginTop: 6,
              }}
            />
            <div>
              <div style={{ fontSize: 12, fontWeight: item.is_read ? 500 : 600 }}>{item.title}</div>
              <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>{timeAgo(item.created_at)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MyServicesPage({ app }) {
  const { linkedServices, bookings, currentUser, openService, navigate } = app;

  return (
    <div className="page">
      <PageHeader
        title="My Services"
        description={`${linkedServices.length} linked services`}
        action={<button className="btn-p" onClick={() => navigate('explore')}>🧭 Explore More</button>}
      />

      <div className="card" style={{ padding: 0 }}>
        {linkedServices.map((service, index) => {
          const myServiceBookings = bookings.filter(
            (booking) => booking.service_id === service.id && booking.customer_user_id === currentUser.id,
          );

          return (
            <div
              key={service.id}
              className="row-click"
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                padding: 14,
                borderBottom:
                  index < linkedServices.length - 1
                    ? '0.5px solid var(--color-border-tertiary)'
                    : 'none',
                cursor: 'pointer',
              }}
              onClick={() => openService(service.id)}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--r8)',
                  background: `linear-gradient(135deg, ${service.color}cc, ${service.color}77)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                {service.category.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{service.name}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>
                  {service.category.name} · {service.location}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, fontWeight: 600 }}>{myServiceBookings.length} bookings</div>
                <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>
                  {formatCurrency(service.base_price)}/visit
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ServiceDetailPage({ app }) {
  const { selectedService, currentUser, bookings, offers, navigate } = app;
  const myBookings = bookings
    .filter((booking) => booking.service_id === selectedService.id && booking.customer_user_id === currentUser.id)
    .sort((left, right) => right.booking_date.localeCompare(left.booking_date));
  const activeOffers = offers.filter((offer) => offer.service_id === selectedService.id && offer.is_active);

  return (
    <div className="page">
      <div
        style={{ marginBottom: 16, color: 'var(--color-text-tertiary)', cursor: 'pointer' }}
        onClick={() => navigate('my-services')}
      >
        ← Back to My Services
      </div>

      <div className="g2" style={{ alignItems: 'start' }}>
        <div>
          <div className="card" style={{ overflow: 'hidden', padding: 0, marginBottom: 12 }}>
            <div
              style={{
                height: 120,
                background: `linear-gradient(135deg, ${selectedService.color}dd, ${selectedService.color}88)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 44,
              }}
            >
              {selectedService.category.icon}
            </div>
            <div style={{ padding: 14 }}>
              <div className="flex justify-between" style={{ marginBottom: 10, gap: 10 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{selectedService.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{selectedService.category.name}</div>
                </div>
                <span className="chip on">{selectedService.category.icon} {selectedService.category.name}</span>
              </div>

              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
                {selectedService.description}
              </p>

              <div className="g2" style={{ marginBottom: 12 }}>
                {[
                  ['📍', selectedService.location],
                  ['💰', formatCurrency(selectedService.base_price)],
                  ['⏱', `${selectedService.duration_minutes} min`],
                  ['👤', selectedService.owner.display_name],
                ].map(([icon, value]) => (
                  <div
                    key={value}
                    style={{
                      background: 'var(--color-background-secondary)',
                      borderRadius: 'var(--r8)',
                      padding: 8,
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 14, marginBottom: 2 }}>{icon}</div>
                    <div style={{ fontSize: 11, fontWeight: 600 }}>{value}</div>
                  </div>
                ))}
              </div>

              <AvatarInfo user={selectedService.owner} size={28} />
            </div>
          </div>

          {activeOffers.length ? (
            <div className="card">
              <SectionHeader title="Active offers" />
              {activeOffers.map((offer) => (
                <div key={offer.id} className="ofr" style={{ marginBottom: 8 }}>
                  {offer.valid_until ? (
                    <div style={{ fontSize: 10, color: '#0C447C', fontWeight: 600, marginBottom: 4 }}>
                      Until {formatDate(offer.valid_until)}
                    </div>
                  ) : null}
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 3 }}>{offer.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{offer.body}</div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="card">
          <SectionHeader title="My bookings" meta={`${myBookings.length} total`} />
          {myBookings.length === 0 ? (
            <EmptyState icon="📋" title="No bookings yet" description="Book this service to get started." />
          ) : (
            myBookings.map((booking) => (
              <div key={booking.id} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                <div style={{ width: 36, textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1 }}>
                    {new Date(`${booking.booking_date}T00:00:00`).getDate()}
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>
                    {new Date(`${booking.booking_date}T00:00:00`).toLocaleDateString('en', { month: 'short' })}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{booking.staff_name}</div>
                  <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>
                    {formatTime(booking.start_time)} – {formatTime(booking.end_time)}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <StatusBadge status={booking.status} />
                  <div style={{ fontSize: 11, fontWeight: 600, marginTop: 3 }}>
                    {formatCurrency(booking.amount)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export function CalendarPage({ app }) {
  const {
    bookings,
    currentUser,
    linkedServices,
    selectedDate,
    setSelectedDate,
    calendarMonth,
    calendarYear,
    previousMonth,
    nextMonth,
  } = app;

  const myBookings = bookings.filter((booking) => booking.customer_user_id === currentUser.id);
  const selectedBookings = myBookings
    .filter((booking) => booking.booking_date === selectedDate)
    .sort((left, right) => left.start_time.localeCompare(right.start_time));

  const dotMap = myBookings.reduce((result, booking) => {
    const existing = result[booking.booking_date] || [];
    const color = booking.service?.color || '#2563eb';
    if (!existing.includes(color)) {
      result[booking.booking_date] = [...existing, color];
    }
    return result;
  }, {});

  const legend = linkedServices.map((service) => ({ label: service.name, color: service.color }));

  return (
    <div className="page">
      <PageHeader title="My Calendar" description="All bookings across linked services" />

      <div className="g2" style={{ alignItems: 'start' }}>
        <CalendarGrid
          year={calendarYear}
          month={calendarMonth}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          dotMap={dotMap}
          onPrevMonth={previousMonth}
          onNextMonth={nextMonth}
          legend={legend}
        />

        <div className="card">
          <SectionHeader
            title={formatLongDate(selectedDate)}
            meta={`${selectedBookings.length} booking${selectedBookings.length !== 1 ? 's' : ''}`}
          />
          {selectedBookings.length === 0 ? (
            <EmptyState icon="📅" title="No bookings this day" description="Pick another date from the calendar." />
          ) : (
            selectedBookings.map((booking) => (
              <div key={booking.id} style={{ border: '0.5px solid var(--color-border-tertiary)', borderLeft: `2px solid ${booking.service?.color || '#2563eb'}`, borderRadius: 'var(--r8)', padding: '10px 12px', marginBottom: 8 }}>
                <div className="flex justify-between" style={{ alignItems: 'flex-start', gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{booking.service?.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>
                      ⏰ {formatTime(booking.start_time)} – {formatTime(booking.end_time)} · {booking.staff_name}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <StatusBadge status={booking.status} />
                    <div style={{ fontSize: 11, fontWeight: 600, marginTop: 3 }}>
                      {formatCurrency(booking.amount)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export function ExplorePage({ app }) {
  const { categories, services, exploreCategory, setExploreCategory, linkedIds, providerService, toggleLinkService, openService } = app;
  const filteredServices = exploreCategory === 0
    ? services
    : services.filter((service) => service.category_id === exploreCategory);

  return (
    <div className="page">
      <PageHeader title="Explore Services" description="Discover and link to services near you" />

      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 16 }}>
        <div className={`chip ${exploreCategory === 0 ? 'on' : ''}`} onClick={() => setExploreCategory(0)}>
          ⚡ All
        </div>
        {categories.map((category) => (
          <div
            key={category.id}
            className={`chip ${exploreCategory === category.id ? 'on' : ''}`}
            onClick={() => setExploreCategory(category.id)}
          >
            {category.icon} {category.name}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {filteredServices.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            isLinked={linkedIds.includes(service.id)}
            isOwn={service.id === providerService.id}
            onView={openService}
            onAdd={toggleLinkService}
          />
        ))}
      </div>
    </div>
  );
}

export function LatestPage({ app }) {
  const { notifications, unreadCount, markAllNotificationsRead, markNotificationRead } = app;
  const iconMap = {
    booking_created: { bg: '#E6F1FB', color: '#0C447C', icon: '📅' },
    status_changed: { bg: '#FAEEDA', color: '#633806', icon: '🔄' },
    offer_posted: { bg: '#EEEDFE', color: '#26215C', icon: '🏷️' },
    new_customer_linked: { bg: '#EAF3DE', color: '#27500A', icon: '🔗' },
  };

  return (
    <div className="page">
      <PageHeader
        title="Latest"
        description={`${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
        action={
          unreadCount > 0 ? (
            <button className="btn-s" onClick={markAllNotificationsRead}>
              Mark all read
            </button>
          ) : null
        }
      />

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {notifications.length === 0 ? (
          <EmptyState icon="🔔" title="All caught up" description="New updates will appear here." />
        ) : (
          notifications.map((item) => {
            const visual = iconMap[item.type] || iconMap.booking_created;

            return (
              <div
                key={item.id}
                className={`ni-item ${item.is_read ? '' : 'unread'}`}
                onClick={() => markNotificationRead(item.id)}
              >
                <div className="ni-ic" style={{ background: visual.bg, color: visual.color }}>
                  {visual.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: item.is_read ? 500 : 600 }}>{item.title}</div>
                  {item.body ? (
                    <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>{item.body}</div>
                  ) : null}
                  <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)', marginTop: 3 }}>
                    {timeAgo(item.created_at)}
                  </div>
                </div>
                {!item.is_read ? (
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#2563eb', marginTop: 3 }} />
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
