const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = String(now.getMonth() + 1).padStart(2, '0');

const dateInCurrentMonth = (day) =>
  `${currentYear}-${currentMonth}-${String(day).padStart(2, '0')}`;

const todayKey = `${currentYear}-${currentMonth}-${String(now.getDate()).padStart(2, '0')}`;
const timeAgoIso = (milliseconds) => new Date(Date.now() - milliseconds).toISOString();

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const users = [
  { id: 1, handle: 'priya_sharma', display_name: 'Priya Sharma', email: 'priya@example.com', phone: '9876543210' },
  { id: 2, handle: 'rahul_mehta_92', display_name: 'Rahul Mehta', email: 'rahul@example.com', phone: '9123456789' },
  { id: 3, handle: 'ananya_patel', display_name: 'Ananya Patel', email: 'ananya@example.com', phone: '9988776655' },
  { id: 4, handle: 'vikram_nair', display_name: 'Vikram Nair', email: 'vikram@example.com', phone: '9012345678' },
  { id: 5, handle: 'sneha_k', display_name: 'Sneha Kulkarni', email: 'sneha@example.com', phone: '9345678901' },
  { id: 6, handle: 'arjun_singh', display_name: 'Arjun Singh', email: 'arjun@example.com', phone: '9567890123' },
];

export const currentUser = users[1];

export const categories = [
  { id: 1, name: 'Photography', icon: '📷', color: '#7c3aed' },
  { id: 2, name: 'Salon & Grooming', icon: '✂️', color: '#db2777' },
  { id: 3, name: 'Spa & Wellness', icon: '🌿', color: '#059669' },
  { id: 4, name: 'Fitness', icon: '🏋️', color: '#d97706' },
  { id: 5, name: 'Education', icon: '📚', color: '#2563eb' },
];

const servicesRaw = [
  {
    id: 1,
    owner_user_id: 1,
    category_id: 1,
    name: 'Priya Captures',
    description: 'Professional photography for portraits, events, and weddings.',
    location: 'Mumbai, Bandra',
    base_price: 5000,
    duration_minutes: 120,
    color: '#7c3aed',
  },
  {
    id: 2,
    owner_user_id: 2,
    category_id: 2,
    name: "Rahul's Salon",
    description: 'Premium haircuts, styling, and beard grooming for everyone.',
    location: 'Pune, Koregaon Park',
    base_price: 800,
    duration_minutes: 60,
    color: '#db2777',
  },
  {
    id: 3,
    owner_user_id: 6,
    category_id: 3,
    name: 'Divya Wellness',
    description: 'Holistic spa, massage, and relaxation therapy.',
    location: 'Nagpur, Sitabuldi',
    base_price: 2200,
    duration_minutes: 90,
    color: '#059669',
  },
  {
    id: 4,
    owner_user_id: 5,
    category_id: 4,
    name: 'FitZone',
    description: 'Personal training and nutrition coaching.',
    location: 'Pune, Wakad',
    base_price: 1500,
    duration_minutes: 60,
    color: '#d97706',
  },
  {
    id: 5,
    owner_user_id: 4,
    category_id: 5,
    name: 'Karan Tutors',
    description: 'Expert coaching in Maths, Physics, and Coding.',
    location: 'Online / Nagpur',
    base_price: 600,
    duration_minutes: 60,
    color: '#2563eb',
  },
];

export const services = servicesRaw.map((service) => ({
  ...service,
  owner: users.find((user) => user.id === service.owner_user_id),
  category: categories.find((category) => category.id === service.category_id),
}));

export const initialLinkedIds = [1, 3, 4];

const createBooking = (
  id,
  serviceId,
  customerUserId,
  customerName,
  customerHandle,
  staffName,
  bookingDate,
  startTime,
  endTime,
  status,
  amount,
  notes,
) => ({
  id,
  service_id: serviceId,
  customer_user_id: customerUserId,
  customer_name: customerName,
  customer_handle: customerHandle,
  staff_name: staffName,
  booking_date: bookingDate,
  start_time: startTime,
  end_time: endTime,
  status,
  amount,
  notes,
  service: services.find((service) => service.id === serviceId),
  customer_user: customerUserId ? users.find((user) => user.id === customerUserId) : null,
});

export const initialBookings = [
  createBooking(1, 2, 3, 'Ananya Patel', 'ananya_patel', 'Rahul Mehta', dateInCurrentMonth(3), '09:00', '10:00', 'confirmed', 800, 'Regular haircut'),
  createBooking(2, 2, 4, 'Vikram Nair', 'vikram_nair', 'Karan Mehta', dateInCurrentMonth(5), '10:00', '10:45', 'completed', 500, ''),
  createBooking(3, 2, 5, 'Sneha Kulkarni', 'sneha_k', 'Rahul Mehta', dateInCurrentMonth(8), '11:00', '12:00', 'pending', 800, 'Colour consult'),
  createBooking(4, 2, 3, 'Ananya Patel', 'ananya_patel', 'Karan Mehta', dateInCurrentMonth(10), '14:00', '15:00', 'confirmed', 800, 'Styling'),
  createBooking(5, 2, 4, 'Vikram Nair', 'vikram_nair', 'Rahul Mehta', dateInCurrentMonth(12), '09:30', '10:30', 'cancelled', 800, ''),
  createBooking(6, 2, 5, 'Sneha Kulkarni', 'sneha_k', 'Karan Mehta', dateInCurrentMonth(14), '10:00', '11:00', 'confirmed', 1200, 'Colour treatment'),
  createBooking(7, 2, 3, 'Ananya Patel', 'ananya_patel', 'Rahul Mehta', todayKey, '09:00', '10:00', 'confirmed', 800, 'Regular'),
  createBooking(8, 2, 5, 'Sneha Kulkarni', 'sneha_k', 'Karan Mehta', todayKey, '11:00', '12:00', 'pending', 1200, 'Colour'),
  createBooking(9, 2, 4, 'Vikram Nair', 'vikram_nair', 'Rahul Mehta', todayKey, '14:00', '14:45', 'confirmed', 500, ''),
  createBooking(10, 1, 2, 'Rahul Mehta', 'rahul_mehta_92', 'Priya Sharma', dateInCurrentMonth(7), '09:00', '11:00', 'confirmed', 5000, 'Product shoot'),
  createBooking(11, 3, 2, 'Rahul Mehta', 'rahul_mehta_92', 'Divya', dateInCurrentMonth(11), '15:00', '16:30', 'completed', 2200, 'Massage'),
  createBooking(12, 3, 2, 'Rahul Mehta', 'rahul_mehta_92', 'Divya', todayKey, '18:00', '19:30', 'confirmed', 2200, 'Evening session'),
];

export const initialNotifications = [
  {
    id: 1,
    type: 'booking_created',
    title: "New booking at Rahul's Salon",
    body: 'Ananya Patel confirmed for today at 9:00 AM.',
    is_read: false,
    created_at: timeAgoIso(60 * 60 * 1000),
  },
  {
    id: 2,
    type: 'status_changed',
    title: 'Booking updated — Divya Wellness',
    body: 'Your spa booking is now completed.',
    is_read: false,
    created_at: timeAgoIso(2 * 60 * 60 * 1000),
  },
  {
    id: 3,
    type: 'new_customer_linked',
    title: 'New customer: @arjun_singh',
    body: "Arjun Singh added Rahul's Salon.",
    is_read: false,
    created_at: timeAgoIso(24 * 60 * 60 * 1000),
  },
  {
    id: 4,
    type: 'offer_posted',
    title: 'New offer from Divya Wellness',
    body: 'First-time visitors get a free foot massage!',
    is_read: true,
    created_at: timeAgoIso(2 * 24 * 60 * 60 * 1000),
  },
];

export const initialOffers = [
  {
    id: 1,
    service_id: 2,
    title: 'Weekend Flash Sale',
    body: 'Get 20% off all haircut and styling packages this weekend. Valid for linked customers only.',
    valid_until: dateInCurrentMonth(20),
    is_active: true,
    service: services[1],
  },
  {
    id: 2,
    service_id: 2,
    title: 'Refer & Earn',
    body: 'Refer a friend and both get ₹100 off your next visit. No limit!',
    valid_until: null,
    is_active: true,
    service: services[1],
  },
  {
    id: 3,
    service_id: 3,
    title: 'New Member Welcome',
    body: 'First-time visitors get a free 15-min foot massage with any full-body package.',
    valid_until: null,
    is_active: true,
    service: services[2],
  },
];
