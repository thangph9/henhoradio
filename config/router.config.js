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
    path: '/question',
    component: './Question',
  },
  /*
    {
    path: '/search-list',
    component: '../layouts/HomeLayout',
    routes: [{ path: '/search-list', component: './SearchList' }],
  },
  {
    path: '/detail-list',
    component: '../layouts/HomeLayout',
    routes: [{ path: '/detail-list', component: './DetailListRadio' }],
  },
  */
  {
    path: '/',
    component: './About',
  },
  {
    path: '/home',
    component: '../layouts/HomeLayout',
    // Routes: ['src/pages/Authorized'],
    // authority: ['member'],
    routes: [
      { path: '/home', redirect: './newfeed' },
      { path: '/home/newfeed', component: './HomePage' },
      { path: '/home/profile', component: './ProfileDetail' },
      { path: '/home/search-list', component: './SearchList' },
      { path: '/home/detail-list', component: './DetailListRadio' },
      { path: '/home/profile-user', redirect: '/home/profile-user/information' },
      {
        path: '/home/profile-user',
        component: './ProfileDetailUser/Info',
        routes: [
          {
            path: '/home/profile-user/information',
            component: './ProfileDetailUser/ThongTinCaNhan',
          },
          {
            path: '/home/profile-user/setting-security',
            component: './ProfileDetailUser/CaiDatBaoMat',
          },
          {
            path: '/home/profile-user/answer-question',
            component: './ProfileDetailUser/HoiDapCaNhan',
          },
        ],
      },
      { path: '/home/other-profile', component: './ProfileDatailWithOther' },
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
  {
    path: '/landing-page',
    routes: [{ path: '/landing-page', component: './LandingPage' }],
  },
  // front-end

  {
    component: '404',
  },
];
