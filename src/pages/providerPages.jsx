import { useState } from 'react';
import { AvatarInfo } from '../components/ui/Avatar';
import CalendarGrid from '../components/ui/CalendarGrid';
import EmptyState from '../components/ui/EmptyState';
import MetricCard from '../components/ui/MetricCard';
import SectionHeader from '../components/ui/SectionHeader';
import StatusBadge from '../components/ui/StatusBadge';
import { formatCurrency, formatDate, formatLongDate, formatTime, statusColorMap } from '../utils/formatters';

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

function ProgressBar({ value, max, color = '#2563eb' }) {
  const percentage = max ? Math.round((value / max) * 100) : 0;

  return (
    <div className="prog-t">
      <div className="prog-f" style={{ width: `${percentage}%`, background: color }} />
    </div>
  );
}

export function ProviderDashboardPage({ app }) {
  const { providerService, bookings, offers, navigate } = app;
  const today = new Date().toISOString().slice(0, 10);
  const providerBookings = bookings.filter((booking) => booking.service_id === providerService.id);
  const todayBookings = providerBookings.filter((booking) => booking.booking_date === today);
  const revenue = providerBookings
    .filter((booking) => ['confirmed', 'completed'].includes(booking.status))
    .reduce((sum, booking) => sum + Number(booking.amount), 0);
  const customerCount = new Set(providerBookings.map((booking) => booking.customer_user_id).filter(Boolean)).size;
  const activeOffers = offers.filter((offer) => offer.service_id === providerService.id && offer.is_active);

  return (
    <div className="page">
      <PageHeader
        title={`${providerService.name} Provider`}
        description={`${providerService.category.name} · ${providerService.location}`}
        action={<button className="btn-p" onClick={() => navigate('manage-bookings')}>📋 Review bookings</button>}
      />

      <div className="g4" style={{ marginBottom: 14 }}>
        <MetricCard label="Today" value={todayBookings.length} subtext="Bookings" color="#2563eb" />
        <MetricCard label="This month" value={providerBookings.length} subtext="Total" color="#059669" />
        <MetricCard label="Revenue" value={formatCurrency(revenue)} subtext="Confirmed" color="#d97706" />
        <MetricCard label="Customers" value={customerCount} subtext="Linked" color="#7c3aed" />
      </div>

      <div className="g2">
        <div className="card">
          <SectionHeader title="Today's schedule" meta={`${todayBookings.length} appts`} />
          {todayBookings.length === 0 ? (
            <EmptyState icon="📅" title="No bookings today" description="Promote a quick offer to fill the calendar." />
          ) : (
            todayBookings.map((booking) => (
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

        <div className="card">
          <SectionHeader
            title="Active offers"
            action={<button className="btn-s" onClick={() => navigate('offers')}>Manage</button>}
          />
          {activeOffers.length === 0 ? (
            <EmptyState icon="🏷️" title="No active offers" description="Create a post to notify linked customers." />
          ) : (
            activeOffers.slice(0, 2).map((offer) => (
              <div key={offer.id} className="ofr" style={{ marginBottom: 8 }}>
                {offer.valid_until ? (
                  <div style={{ fontSize: 10, color: '#0C447C', fontWeight: 600, marginBottom: 3 }}>
                    Until {formatDate(offer.valid_until)}
                  </div>
                ) : null}
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{offer.title}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{offer.body}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export function ManageBookingsPage({ app }) {
  const { providerService, bookings, bookingSearch, setBookingSearch, bookingFilter, setBookingFilter, updateBookingStatus } = app;
  const providerBookings = bookings.filter((booking) => booking.service_id === providerService.id);
  const filteredBookings = providerBookings.filter((booking) => {
    const query = bookingSearch.toLowerCase();
    const matchesQuery =
      !query ||
      booking.customer_name.toLowerCase().includes(query) ||
      (booking.customer_handle || '').toLowerCase().includes(query);
    const matchesFilter = bookingFilter === 'all' || booking.status === bookingFilter;
    return matchesQuery && matchesFilter;
  });

  return (
    <div className="page">
      <PageHeader title="Manage Bookings" description={`${filteredBookings.length} of ${providerBookings.length} bookings`} />

      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        <input
          className="inp"
          style={{ flex: 1, minWidth: 220 }}
          placeholder="Search customers…"
          value={bookingSearch}
          onChange={(event) => setBookingSearch(event.target.value)}
        />
        <select className="sel" style={{ width: 160 }} value={bookingFilter} onChange={(event) => setBookingFilter(event.target.value)}>
          <option value="all">All statuses</option>
          {['confirmed', 'pending', 'cancelled', 'completed', 'no_show'].map((status) => (
            <option key={status} value={status}>
              {status.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Date & Time</th>
              <th>Staff</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: 28, color: 'var(--color-text-tertiary)' }}>
                  No bookings found
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <AvatarInfo user={booking.customer_user || { display_name: booking.customer_name, handle: booking.customer_handle || 'walkin' }} size={26} />
                  </td>
                  <td>
                    <div>{formatDate(booking.booking_date)}</div>
                    <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>
                      {formatTime(booking.start_time)} – {formatTime(booking.end_time)}
                    </div>
                  </td>
                  <td>{booking.staff_name}</td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(booking.amount)}</td>
                  <td>
                    <select
                      className="sel"
                      value={booking.status}
                      onChange={(event) => updateBookingStatus(booking.id, event.target.value)}
                    >
                      {['confirmed', 'pending', 'requested', 'cancelled', 'completed', 'no_show'].map((status) => (
                        <option key={status} value={status}>
                          {status.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CustomersPage({ app }) {
  const { providerService, bookings } = app;
  const providerBookings = bookings.filter((booking) => booking.service_id === providerService.id);
  const customerIds = [...new Set(providerBookings.map((booking) => booking.customer_user_id).filter(Boolean))];
  const customers = customerIds
    .map((customerId) => {
      const history = providerBookings.filter((booking) => booking.customer_user_id === customerId);
      const firstBooking = history[0];
      return {
        user: firstBooking?.customer_user,
        count: history.length,
        revenue: history
          .filter((booking) => ['confirmed', 'completed'].includes(booking.status))
          .reduce((sum, booking) => sum + Number(booking.amount), 0),
        lastBooking: history.sort((left, right) => right.booking_date.localeCompare(left.booking_date))[0],
      };
    })
    .filter((entry) => entry.user);

  return (
    <div className="page">
      <PageHeader title="Customers" description={`${customers.length} linked customers`} />

      <div className="card" style={{ padding: 0 }}>
        {customers.length === 0 ? (
          <EmptyState icon="👥" title="No customers yet" description="Bookings will build your customer list." />
        ) : (
          customers.map((customer, index) => (
            <div
              key={customer.user.id}
              className="row-click"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: 12,
                borderBottom: index < customers.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none',
              }}
            >
              <AvatarInfo user={customer.user} size={32} />
              <div style={{ display: 'flex', gap: 16, marginLeft: 'auto', textAlign: 'right' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{customer.count}</div>
                  <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>bookings</div>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{formatCurrency(customer.revenue)}</div>
                  <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>revenue</div>
                </div>
                <div>
                  <div style={{ fontSize: 12 }}>{formatDate(customer.lastBooking?.booking_date)}</div>
                  <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>last visit</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function ProviderCalendarPage({ app }) {
  const {
    providerService,
    bookings,
    selectedDate,
    setSelectedDate,
    calendarMonth,
    calendarYear,
    previousMonth,
    nextMonth,
  } = app;

  const providerBookings = bookings.filter((booking) => booking.service_id === providerService.id);
  const selectedBookings = providerBookings
    .filter((booking) => booking.booking_date === selectedDate)
    .sort((left, right) => left.start_time.localeCompare(right.start_time));

  const dotMap = providerBookings.reduce((result, booking) => {
    const existing = result[booking.booking_date] || [];
    const color = statusColorMap[booking.status] || '#2563eb';
    if (!existing.includes(color)) {
      result[booking.booking_date] = [...existing, color];
    }
    return result;
  }, {});

  const legend = [
    { label: 'Confirmed', color: statusColorMap.confirmed },
    { label: 'Pending', color: statusColorMap.pending },
    { label: 'Cancelled', color: statusColorMap.cancelled },
  ];

  return (
    <div className="page">
      <PageHeader title="Provider Calendar" description={`${providerService.name} schedule`} />

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
            <EmptyState icon="📅" title="No bookings on this date" description="Select another date to view the schedule." />
          ) : (
            selectedBookings.map((booking) => (
              <div key={booking.id} style={{ border: '0.5px solid var(--color-border-tertiary)', borderLeft: `2px solid ${statusColorMap[booking.status] || '#2563eb'}`, borderRadius: 'var(--r8)', padding: '10px 12px', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <AvatarInfo user={booking.customer_user || { display_name: booking.customer_name, handle: booking.customer_handle || 'walkin' }} size={24} />
                  <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <StatusBadge status={booking.status} />
                    <div style={{ fontSize: 11, fontWeight: 600, marginTop: 2 }}>{formatCurrency(booking.amount)}</div>
                  </div>
                </div>
                <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>
                  ⏰ {formatTime(booking.start_time)} – {formatTime(booking.end_time)} · {booking.staff_name}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export function AnalyticsPage({ app }) {
  const { providerService, bookings } = app;
  const providerBookings = bookings.filter((booking) => booking.service_id === providerService.id);
  const revenue = providerBookings
    .filter((booking) => ['confirmed', 'completed'].includes(booking.status))
    .reduce((sum, booking) => sum + Number(booking.amount), 0);
  const customers = new Set(providerBookings.map((booking) => booking.customer_user_id).filter(Boolean)).size;

  const stats = providerBookings.reduce(
    (result, booking) => ({ ...result, [booking.status]: (result[booking.status] || 0) + 1 }),
    { confirmed: 0, pending: 0, cancelled: 0, completed: 0, no_show: 0 },
  );

  const staff = providerBookings.reduce((result, booking) => {
    const item = result[booking.staff_name] || { count: 0, revenue: 0 };
    item.count += 1;
    if (['confirmed', 'completed'].includes(booking.status)) {
      item.revenue += Number(booking.amount);
    }
    result[booking.staff_name] = item;
    return result;
  }, {});

  const staffList = Object.entries(staff).sort((left, right) => right[1].revenue - left[1].revenue);
  const maxRevenue = Math.max(...staffList.map((item) => item[1].revenue), 1);

  return (
    <div className="page">
      <PageHeader title="Analytics" description={`${providerService.name} — this month`} />

      <div className="g4" style={{ marginBottom: 14 }}>
        <MetricCard label="Total bookings" value={providerBookings.length} color="#2563eb" />
        <MetricCard label="Revenue" value={formatCurrency(revenue)} color="#d97706" />
        <MetricCard label="Customers" value={customers} color="#7c3aed" />
        <MetricCard label="Cancellations" value={stats.cancelled} color="#dc2626" />
      </div>

      <div className="g2" style={{ marginBottom: 12 }}>
        <div className="card">
          <SectionHeader title="Status breakdown" />
          {Object.entries(stats).map(([status, count]) => (
            <div key={status} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', textTransform: 'capitalize' }}>
                  {status.replace('_', ' ')}
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, color: statusColorMap[status] || '#2563eb' }}>
                  {count}
                </span>
              </div>
              <ProgressBar value={count} max={providerBookings.length || 1} color={statusColorMap[status] || '#2563eb'} />
            </div>
          ))}
        </div>

        <div className="card">
          <SectionHeader title="Staff performance" />
          {staffList.map(([name, data]) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 'var(--r8)',
                  background: '#EFF4FF',
                  color: '#0C447C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {name.split(' ').map((part) => part[0]).join('')}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{name}</div>
                <ProgressBar value={data.revenue} max={maxRevenue} />
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{formatCurrency(data.revenue)}</div>
                <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>{data.count} appts</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function OffersPage({ app }) {
  const { providerService, offers, createOffer, deleteOffer } = app;
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [validUntil, setValidUntil] = useState('');

  const providerOffers = offers.filter((offer) => offer.service_id === providerService.id);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim() || !body.trim()) return;

    createOffer({
      title: title.trim(),
      body: body.trim(),
      validUntil,
    });

    setTitle('');
    setBody('');
    setValidUntil('');
  };

  return (
    <div className="page">
      <PageHeader title="Offers & Posts" description="Reach all linked customers instantly" />

      <div className="g2" style={{ alignItems: 'start' }}>
        <form className="card" onSubmit={handleSubmit}>
          <SectionHeader title="Post New Offer" />
          <div className="ff">
            <label className="fl">Title</label>
            <input className="inp" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Weekend Flash Sale 🎉" />
          </div>
          <div className="ff">
            <label className="fl">Message</label>
            <textarea className="ta" value={body} onChange={(event) => setBody(event.target.value)} placeholder="Describe your offer…" />
          </div>
          <div className="ff">
            <label className="fl">Valid until (optional)</label>
            <input className="inp" type="date" value={validUntil} onChange={(event) => setValidUntil(event.target.value)} />
          </div>
          <button type="submit" className="btn-p">Post Offer 📣</button>
        </form>

        <div>
          {providerOffers.length === 0 ? (
            <div className="card">
              <EmptyState icon="🏷️" title="No offers yet" description="Create your first post for linked customers." />
            </div>
          ) : (
            providerOffers.map((offer) => (
              <div key={offer.id} className="card" style={{ borderLeft: '2px solid #2563eb', marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: '#0C447C', fontWeight: 600, marginBottom: 4 }}>
                      {offer.valid_until ? `Valid until ${formatDate(offer.valid_until)}` : 'Always active'}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 5 }}>{offer.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{offer.body}</div>
                  </div>
                  <button type="button" className="btn-d" onClick={() => deleteOffer(offer.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export function OnboardServicePage({ app }) {
  const { navigate, categories } = app;

  return (
    <div className="page" style={{ maxWidth: 560, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div
          style={{
            width: 52,
            height: 52,
            background: '#EFF4FF',
            borderRadius: 'var(--r12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            margin: '0 auto 12px',
          }}
        >
          🚀
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Onboard your service</h1>
        <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>
          Start managing bookings and reaching customers
        </p>
      </div>

      <form
        className="card"
        onSubmit={(event) => {
          event.preventDefault();
          navigate('provider-dashboard');
        }}
      >
        <div className="ff">
          <label className="fl">Service name</label>
          <input className="inp" placeholder="e.g. Priya Photography Studio" />
        </div>
        <div className="g2">
          <div className="ff">
            <label className="fl">Category</label>
            <select className="sel">
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="ff">
            <label className="fl">Location</label>
            <input className="inp" placeholder="City, Area" />
          </div>
        </div>
        <div className="ff">
          <label className="fl">Description</label>
          <textarea className="ta" placeholder="Tell customers what you offer…" />
        </div>
        <div className="g2">
          <div className="ff">
            <label className="fl">Base price (₹)</label>
            <input className="inp" type="number" placeholder="1500" />
          </div>
          <div className="ff">
            <label className="fl">Duration (min)</label>
            <input className="inp" type="number" placeholder="60" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" className="btn-s" style={{ flex: 1, justifyContent: 'center' }} onClick={() => navigate('dashboard')}>
            Cancel
          </button>
          <button type="submit" className="btn-p" style={{ flex: 1, justifyContent: 'center' }}>
            Onboard Service 🚀
          </button>
        </div>
      </form>
    </div>
  );
}

export function ProfilePage({ app }) {
  const { currentUser, providerService, bookings, linkedIds, navigate, signOut } = app;
  const customerBookings = bookings.filter((booking) => booking.customer_user_id === currentUser.id);
  const providerBookings = bookings.filter((booking) => booking.service_id === providerService.id);

  return (
    <div className="page" style={{ maxWidth: 520, margin: '0 auto' }}>
      <div className="card" style={{ overflow: 'hidden', padding: 0, marginBottom: 12 }}>
        <div style={{ height: 70, background: '#2563eb' }} />
        <div style={{ padding: '0 18px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: -24, marginBottom: 14 }}>
            <div
              className="av"
              style={{ width: 50, height: 50, background: '#eff4ff', border: '2.5px solid #2563eb', color: '#2563eb', fontSize: 18 }}
            >
              {currentUser.display_name
                .split(' ')
                .map((part) => part[0])
                .join('')}
            </div>
            <button className="btn-s" style={{ fontSize: 11, padding: '5px 10px' }}>Edit profile</button>
          </div>
          <div style={{ fontSize: 17, fontWeight: 700 }}>{currentUser.display_name}</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', fontFamily: 'monospace', marginTop: 2 }}>
            @{currentUser.handle}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 3 }}>{currentUser.email}</div>
        </div>
      </div>

      <div className="g2" style={{ marginBottom: 12 }}>
        <MetricCard label="Linked Services" value={linkedIds.length} color="#2563eb" />
        <MetricCard label="My Bookings" value={customerBookings.length} color="#059669" />
      </div>

      <div className="card" style={{ background: `${providerService.color}08`, borderColor: `${providerService.color}30`, marginBottom: 12 }}>
        <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 5 }}>
          Service Provider
        </div>
        <div style={{ fontSize: 15, fontWeight: 700 }}>{providerService.name}</div>
        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>
          {providerService.category.name} · {providerService.location}
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: 2 }}>
          {providerBookings.length} bookings this month
        </div>
        <button className="btn-s" style={{ marginTop: 10 }} onClick={() => navigate('provider-dashboard')}>
          Go to provider dashboard →
        </button>
      </div>

      <button className="btn-d" style={{ width: '100%', justifyContent: 'center' }} onClick={signOut}>
        Sign out
      </button>
    </div>
  );
}
