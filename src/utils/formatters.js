export const statusClassMap = {
  confirmed: 'b-confirmed',
  pending: 'b-pending',
  cancelled: 'b-cancelled',
  completed: 'b-completed',
  no_show: 'b-no_show',
  requested: 'b-completed',
};

export const statusColorMap = {
  confirmed: '#059669',
  pending: '#d97706',
  cancelled: '#dc2626',
  completed: '#0891b2',
  no_show: '#888888',
  requested: '#2563eb',
};

export const statusLabelMap = {
  confirmed: 'Confirmed',
  pending: 'Pending',
  cancelled: 'Cancelled',
  completed: 'Completed',
  no_show: 'No Show',
  requested: 'Requested',
};

const avatarPalette = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626', '#0891b2', '#65a30d', '#db2777'];

export const avatarColor = (seed = '') => {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = seed.charCodeAt(index) + ((hash << 5) - hash);
  }

  return avatarPalette[Math.abs(hash) % avatarPalette.length];
};

export const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'U';

export const formatDate = (value) => {
  if (!value) return '—';
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
};

export const formatLongDate = (value) => {
  if (!value) return '—';
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
};

export const formatTime = (time) => {
  if (!time) return '—';

  const [hours, minutes] = time.split(':').map(Number);
  return `${hours % 12 || 12}:${String(minutes).padStart(2, '0')} ${hours < 12 ? 'AM' : 'PM'}`;
};

export const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

export const timeAgo = (isoString) => {
  const seconds = Math.floor((Date.now() - new Date(isoString)) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return 'Yesterday';
};

export const getTodayKey = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const getDateKey = (year, month, day) =>
  `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

export const buildCalendarCells = (year, month) => {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const previousMonthDays = new Date(year, month - 1, 0).getDate();
  const cells = [];

  for (let index = 0; index < firstDay; index += 1) {
    cells.push({ day: previousMonthDays - firstDay + 1 + index, isCurrentMonth: false });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ day, isCurrentMonth: true });
  }

  while (cells.length < 35) {
    cells.push({ day: cells.length - daysInMonth - firstDay + 1, isCurrentMonth: false });
  }

  return cells;
};
