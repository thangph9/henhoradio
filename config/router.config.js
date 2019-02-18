export default [
  // user
  {
    path: '/login',
    component: '../layouts/EmptyLayout',
    routes: [{ path: '/login', component: './Login' }],
  },
  {
    path: '/forgot',
    component: '../layouts/ForgotPassLayout',
    routes: [{ path: '/forgot', component: './ForgotPass' }],
  },
  {
    path: '/search-list',
    component: '../layouts/EmptyLayout',
    routes: [{ path: '/search-list', component: './SearchList' }],
  },
  {
    path: '/',
    component: './About',
  },
  {
    path: '/home',
    component: '../layouts/HomeLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['member'],
    routes: [
      { path: '/home', redirect: './newfeed' },
      { path: '/home/newfeed', component: './HomePage/NewFeed' },
      { path: '/home/profile', component: './ProfileDetail' },
      {
        component: '404',
      },
    ],
  },
  {
    path: '/register-result',
    component: '../layouts/HomeLayout',
    routes: [
      { path: '/register-result', component: './ResgisterResult' },
      {
        component: '404',
      },
    ],
  },
  {
    path: '/test',
    component: '../layouts/EmptyLayout',
    routes: [{ path: '/test', component: './User/RegisterResult.js' }],
  },
  // front-end

  {
    component: '404',
  },
];
