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
    redirect: './login',
  },
  {
    path: '/home',
    component: '../layouts/HomeLayout',
    // Routes: ['src/pages/Authorized'],
    // authority: ['member'],
    routes: [
      { path: '/home', redirect: './detail-list' },
      { path: '/home/newfeed', component: './HomePage' },
      { path: '/home/profile', component: './ProfileDetail' },
      { path: '/home/search-list', component: './SearchList' },
      { path: '/home/search-test', component: './SearchTest' },
      { path: '/home/detail-list', component: './DetailListRadio' },
      { path: '/home/profile-user', redirect: '/home/profile-user/information' },
      { path: '/home/care', component: './Care' },
      { path: '/home/whocare', component: './WhoCare' },
      { path: '/home/suggestion', component: './Suggestion' },
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
    path: '/register-success',
    component: '../layouts/EmptyLayout',
    routes: [{ path: '/register-success', component: './ResgisterResult' }],
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
