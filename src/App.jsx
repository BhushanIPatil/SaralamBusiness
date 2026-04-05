import AppShell from './components/layout/AppShell';
import { useBooknestApp } from './hooks/useBooknestApp';
import AuthPage from './pages/AuthPage';
import {
  CalendarPage,
  DashboardPage,
  ExplorePage,
  LatestPage,
  MyServicesPage,
  ServiceDetailPage,
} from './pages/customerPages';
import {
  AnalyticsPage,
  CustomersPage,
  ManageBookingsPage,
  OffersPage,
  OnboardServicePage,
  ProfilePage,
  ProviderCalendarPage,
  ProviderDashboardPage,
} from './pages/providerPages';

const pages = {
  dashboard: DashboardPage,
  'my-services': MyServicesPage,
  'service-detail': ServiceDetailPage,
  calendar: CalendarPage,
  explore: ExplorePage,
  latest: LatestPage,
  'provider-dashboard': ProviderDashboardPage,
  'manage-bookings': ManageBookingsPage,
  customers: CustomersPage,
  'provider-calendar': ProviderCalendarPage,
  analytics: AnalyticsPage,
  offers: OffersPage,
  'onboard-service': OnboardServicePage,
  profile: ProfilePage,
};

export default function App() {
  const app = useBooknestApp();

  if (!app.isAuthenticated) {
    return <AuthPage app={app} />;
  }

  const CurrentPage = pages[app.page] ?? DashboardPage;

  return (
    <AppShell app={app}>
      <CurrentPage app={app} />
    </AppShell>
  );
}
