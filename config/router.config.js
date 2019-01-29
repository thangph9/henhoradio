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
    path: '/',
    component: '../layouts/HomeLayout',
    routes: [
      { path: '/', redirect: '/login' },
      { path: '/login', component: './Login' },
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
