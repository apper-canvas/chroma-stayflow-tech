import Dashboard from '@/components/pages/Dashboard';
import Rooms from '@/components/pages/Rooms';
import Reservations from '@/components/pages/Reservations';
import Housekeeping from '@/components/pages/Housekeeping';
import Settings from '@/components/pages/Settings';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  rooms: {
    id: 'rooms',
    label: 'Rooms',
    path: '/rooms',
    icon: 'Bed',
    component: Rooms
  },
  reservations: {
    id: 'reservations',
    label: 'Reservations',
    path: '/reservations',
    icon: 'Calendar',
    component: Reservations
  },
  housekeeping: {
    id: 'housekeeping',
    label: 'Housekeeping',
    path: '/housekeeping',
    icon: 'Sparkles',
    component: Housekeeping
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  }
};

export const routeArray = Object.values(routes);
export default routes;