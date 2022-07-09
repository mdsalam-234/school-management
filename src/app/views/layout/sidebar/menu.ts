import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  // {
  //   label: 'Main',
  //   isTitle: true
  // },
  {
    label: 'Dashboard',
    icon: 'home',
    link: '/dashboard'
  },
  {
    label: 'Students',
    icon: 'user',
    link: '/students'
  },
  {
    label: 'Teachers',
    icon: 'user-check',
    link: '/teachers'
  },
  {
    label: 'Parents',
    icon: 'users',
    link: '/parents'
  },
  {
    label: 'Class',
    icon: 'edit',
    link: '/classes'
  },
  {
    label: 'Subject',
    icon: 'book-open',
    link: '/subjects'
  },
  {
    label: 'Attendance',
    icon: 'book',
    link: '/attendance'
  },
  {
    label: 'Hostel',
    icon: 'home',
    link: '/hostel'
  },
  {
    label: 'Notice',
    icon: 'bell',
    link: '/attendance'
  },
  {
    label: 'Account',
    icon: 'settings',
    link: '/attendance'
  }
];
