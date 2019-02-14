export default [
  // user
  {
    path: '/login',
    component: '../layouts/BlankLayout',
    routes: [{ path: '/login', component: './Login' }],
  },
  {
    path: '/forgot',
    component: '../layouts/ForgotPassLayout',
    routes: [{ path: '/forgot', component: './ForgotPass' }],
  },
  {
    path: '/',
    routes: [
      {
        path: '/',
        Routes: ['src/pages/AuthorizedMain'],
        authority: ['member'],
        routers: [{ path: '/main', redirect: '/home' }],
      },
      {
        path: '/home',
        component: '../layouts/HomeLayout',
        Routes: ['src/pages/Authorized'],
        authority: ['member'],
        routes: [
          { path: '/home', redirect: '/dashboard' },
          { path: '/dashboard', component: './HomePage/NewFeed' },
          { path: '/profile', component: './HomePage/ProfileUser' },
          {
            component: '404',
          },
        ],
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
    component: '../layouts/BlankLayout',
    routes: [{ path: '/test', component: './User/RegisterResult.js' }],
  },
  // front-end

  {
    component: '404',
  },
];
