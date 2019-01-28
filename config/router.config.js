export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // front-end
  {
    path: '/home',
    component: '../layouts/HomeLayout',
    routes: [{ path: '/home', component: './HomePage/NewFeed' }],
  },
  {
    path: '/profile',
    component: '../layouts/HomeLayout',
    routes: [{ path: '/profile', component: './HomePage/ProfileUser' }],
  },
  {
    path: '/',
    routes: [{ path: '/', redirect: '/login' }, { path: '/login', component: './Login' }],
  },
  {
    component: '404',
  },
];
