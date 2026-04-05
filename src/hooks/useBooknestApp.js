import { useMemo, useState } from 'react';
import {
  categories,
  currentUser,
  initialBookings,
  initialLinkedIds,
  initialNotifications,
  initialOffers,
  services,
} from '../data/mockData';
import { getTodayKey } from '../utils/formatters';

export function useBooknestApp() {
  const now = new Date();
  const [authView, setAuthView] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [page, setPage] = useState('dashboard');
  const [selectedServiceId, setSelectedServiceId] = useState(initialLinkedIds[0]);
  const [linkedIds, setLinkedIds] = useState(initialLinkedIds);
  const [bookings, setBookings] = useState(initialBookings);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [offers, setOffers] = useState(initialOffers);
  const [selectedDate, setSelectedDate] = useState(getTodayKey());
  const [calendarMonth, setCalendarMonth] = useState(now.getMonth() + 1);
  const [calendarYear, setCalendarYear] = useState(now.getFullYear());
  const [exploreCategory, setExploreCategory] = useState(0);
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingFilter, setBookingFilter] = useState('all');

  const providerService = useMemo(
    () => services.find((service) => service.owner_user_id === currentUser.id) ?? services[1],
    [],
  );

  const linkedServices = useMemo(
    () => services.filter((service) => linkedIds.includes(service.id)),
    [linkedIds],
  );

  const selectedService = useMemo(
    () =>
      services.find((service) => service.id === selectedServiceId) ??
      linkedServices[0] ??
      services[0],
    [linkedServices, selectedServiceId],
  );

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.is_read).length,
    [notifications],
  );

  const navigate = (nextPage, options = {}) => {
    if (options.serviceId) {
      setSelectedServiceId(options.serviceId);
    }
    setPage(nextPage);
  };

  const openService = (serviceId) => {
    setSelectedServiceId(serviceId);
    setPage('service-detail');
  };

  const addNotification = (notification) => {
    setNotifications((current) => [
      {
        id: Date.now(),
        is_read: false,
        created_at: new Date().toISOString(),
        ...notification,
      },
      ...current,
    ]);
  };

  const toggleLinkService = (serviceId) => {
    if (linkedIds.includes(serviceId) || serviceId === providerService.id) {
      return;
    }

    const service = services.find((item) => item.id === serviceId);
    setLinkedIds((current) => [...current, serviceId]);

    if (service) {
      addNotification({
        type: 'new_customer_linked',
        title: `Linked to ${service.name}`,
        body: 'You can now view bookings, offers, and updates from this service.',
      });
    }
  };

  const markNotificationRead = (notificationId) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === notificationId ? { ...item, is_read: true } : item,
      ),
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, is_read: true })));
  };

  const updateBookingStatus = (bookingId, status) => {
    setBookings((current) =>
      current.map((booking) =>
        booking.id === bookingId ? { ...booking, status } : booking,
      ),
    );
  };

  const createOffer = ({ title, body, validUntil }) => {
    const newOffer = {
      id: Date.now(),
      service_id: providerService.id,
      title,
      body,
      valid_until: validUntil || null,
      is_active: true,
      service: providerService,
    };

    setOffers((current) => [newOffer, ...current]);
    addNotification({
      type: 'offer_posted',
      title: `New offer from ${providerService.name}`,
      body: title,
    });
  };

  const deleteOffer = (offerId) => {
    setOffers((current) => current.filter((offer) => offer.id !== offerId));
  };

  const previousMonth = () => {
    setCalendarMonth((currentMonth) => {
      if (currentMonth === 1) {
        setCalendarYear((currentYear) => currentYear - 1);
        return 12;
      }
      return currentMonth - 1;
    });
  };

  const nextMonth = () => {
    setCalendarMonth((currentMonth) => {
      if (currentMonth === 12) {
        setCalendarYear((currentYear) => currentYear + 1);
        return 1;
      }
      return currentMonth + 1;
    });
  };

  const signIn = () => {
    setIsAuthenticated(true);
    setPage('dashboard');
  };

  const signOut = () => {
    setIsAuthenticated(false);
    setAuthView('login');
  };

  return {
    authView,
    setAuthView,
    isAuthenticated,
    signIn,
    signOut,
    page,
    navigate,
    openService,
    currentUser,
    categories,
    services,
    providerService,
    selectedService,
    selectedServiceId,
    linkedIds,
    linkedServices,
    toggleLinkService,
    bookings,
    notifications,
    unreadCount,
    offers,
    markNotificationRead,
    markAllNotificationsRead,
    updateBookingStatus,
    createOffer,
    deleteOffer,
    selectedDate,
    setSelectedDate,
    calendarMonth,
    calendarYear,
    previousMonth,
    nextMonth,
    exploreCategory,
    setExploreCategory,
    bookingSearch,
    setBookingSearch,
    bookingFilter,
    setBookingFilter,
  };
}
