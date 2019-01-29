export default [
  // user
  {
    path: '/login',
    component: '../layouts/BlankLayout',
    routes: [{ path: '/login', component: './Login' }],
  },
  // front-end
  {
    path: '/',
    component: '../layouts/HomeLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['member'],
    routes: [
      { path: '/home', component: './HomePage/NewFeed' },
      { path: '/profile', component: './HomePage/ProfileUser' },
      {
        component: '404',
      },
    ],
  },
  {
    component: '404',
  },
];
