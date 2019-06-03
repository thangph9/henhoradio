/* eslint-disable no-underscore-dangle */

/* eslint-disable no-undef-init */
/* eslint-disable no-shadow */
/* eslint-disable prefer-const */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
const async = require('async');
const fs = require('fs');
const driver = require('cassandra-driver');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const request = require('request'); // eslint-disable-line
const models = require('../settings');
/* eslint-disable prefer-destructuring */
const Uuid = models.datatypes.Uuid;

const jwtpublic = fs.readFileSync('./ssl/jwtpublic.pem', 'utf8');
const jwtprivate = fs.readFileSync('./ssl/jwtprivate.pem', 'utf8');

const menu = [
  {
    menuid: '1c24cf55-9ecc-4660-b6f3-5748d1b552af',
    name: 'Trang đăng ký đăng nhập',
  },
  {
    menuid: '1c24cf55-9ecc-4660-b6f3-5748d1b552af',
    name: 'HomePage',
  },
];
const menuitem = [
  {
    menuitemid: 'abf66041-e735-4431-9be1-12ab33274f87',
    activeicon: 'play-circle',
    authority: ['Diamond', 'Gold', 'Guest', 'Member', 'Platium', 'Premium', 'Silver', 'User'],
    icon: 'play-circle',
    name: 'Thính giả lên sóng',
    path: '/home/detail-list',
  },
  {
    menuitemid: '8942413b-c54b-4d08-a347-f4b25ea5fb04',
    activeicon: 'team',
    authority: ['Diamond', 'Gold', 'Platium', 'Premium', 'Silver', 'Member'],
    icon: 'team',
    name: 'Quan tâm',
    path: '/home/care',
  },
  {
    menuitemid: '93b06313-05c1-4c0b-a9a5-bb4715ed642f',
    activeicon: 'play-circle',
    authority: ['Diamond', 'Gold', 'Member', 'Platium', 'Premium', 'Silver', 'User'],
    icon: 'like',
    name: 'Quan tâm bạn',
    path: '/home/whocare',
  },
  {
    menuitemid: 'e286ebff-e298-4b55-9fad-961a85324d48',
    activeicon: 'search',
    authority: ['Diamond', 'Gold', 'Guest', 'Member', 'Platium', 'Premium', 'Silver', 'User'],
    icon: 'search',
    name: 'Nghe lại',
    path: '/home/search-list',
  },
];
const menugroup = [
  {
    menuid: '1c24cf55-9ecc-4660-b6f3-5748d1b552af',
    menuitemid: 'abf66041-e735-4431-9be1-12ab33274f87',
    orderby: 1,
  },
  {
    menuid: '1c24cf55-9ecc-4660-b6f3-5748d1b552af',
    menuitemid: '8942413b-c54b-4d08-a347-f4b25ea5fb04',
    orderby: 2,
  },
  {
    menuid: '1c24cf55-9ecc-4660-b6f3-5748d1b552af',
    menuitemid: '7079cd68-1477-404f-8181-bad3fec2c8ab',
    orderby: 3,
  },
  {
    menuid: '1c24cf55-9ecc-4660-b6f3-5748d1b552af',
    menuitemid: '93b06313-05c1-4c0b-a9a5-bb4715ed642f',
    orderby: 4,
  },
  {
    menuid: '1c24cf55-9ecc-4660-b6f3-5748d1b552af',
    menuitemid: 'e286ebff-e298-4b55-9fad-961a85324d48',
    orderby: 1,
  },
];
function getMenu(req, res) {
  const params = req.params;
  let menuReq = {};
  let menugroupReq = [];
  let menuItemReq = [];

  async.series(
    [
      callback => {
        try {
          menuReq = menu.find(element => element.name === params.menu);
          callback(null, null);
        } catch (e) {
          console.log(e);
        }
      },
      callback => {
        try {
          menugroupReq = menugroup.filter(
            element => element.menuid.toString() === menuReq.menuid.toString()
          );
          callback(null, null);
        } catch (e) {
          console.log(e);
        }
      },
      callback => {
        try {
          menugroupReq.forEach((element, index, sefl) => {
            let obj = menuitem.find(
              value => value.menuitemid.toString() === element.menuitemid.toString()
            );
            if (obj) {
              let a = JSON.stringify(obj);
              let b = JSON.parse(a);
              b.orderby = element.orderby;
              menuItemReq.push(b);
            }
          });
          callback(null, null);
        } catch (e) {
          console.log(e);
        }
      },
    ],
    err => {
      if (err) return res.json({ status: 'error' });
      return res.json({
        status: 'ok',
        data: menuItemReq,
      });
    }
  );
}
export default {
  'GET /api/menu/getmenu/:menu': getMenu,
};
