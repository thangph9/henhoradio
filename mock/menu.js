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
    name: 'Trang Chủ',
  },
];
const menuItem = [
  {
    menuitemid: 'abf66041-e735-4431-9be1-12ab33274f87',
    activeicon: 'play-circle',
    authority: ['diamond', 'gold', 'guest', 'member', 'platium', 'premium', 'silver', 'user'],
    icon: 'play-circle',
    name: 'Thính giả lên sóng',
    path: '/detail-list',
  },
  {
    menuitemid: '8942413b-c54b-4d08-a347-f4b25ea5fb04',
    activeicon: 'team',
    authority: ['diamond', 'gold', 'platium', 'premium', 'silver'],
    icon: 'team',
    name: 'Quan tâm',
    path: '/home/newfeed',
  },
  {
    menuitemid: '7079cd68-1477-404f-8181-bad3fec2c8ab',
    activeicon: 'contacts',
    authority: ['diamond', 'gold', 'guest', 'member', 'platium', 'premium', 'silver', 'user'],
    icon: 'contacts',
    name: 'Đăng ký lên sóng',
    path: '/detail-list',
  },
  {
    menuitemid: '93b06313-05c1-4c0b-a9a5-bb4715ed642f',
    activeicon: 'play-circle',
    authority: ['diamond', 'gold', 'guest', 'member', 'platium', 'premium', 'silver', 'user'],
    icon: 'like',
    name: 'Khám phá',
    path: '/home/newfeed',
  },
  {
    menuitemid: 'e286ebff-e298-4b55-9fad-961a85324d48',
    activeicon: 'search',
    authority: ['diamond', 'gold', 'guest', 'member', 'platium', 'premium', 'silver', 'user'],
    icon: 'search',
    name: 'Nghe lại chương trình',
    path: '/search-list',
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
    orderby: 1,
  },
  {
    menuid: '1c24cf55-9ecc-4660-b6f3-5748d1b552af',
    menuitemid: '7079cd68-1477-404f-8181-bad3fec2c8ab',
    orderby: 1,
  },
  {
    menuid: '1c24cf55-9ecc-4660-b6f3-5748d1b552af',
    menuitemid: '93b06313-05c1-4c0b-a9a5-bb4715ed642f',
    orderby: 1,
  },
  {
    menuid: '1c24cf55-9ecc-4660-b6f3-5748d1b552af',
    menuitemid: 'e286ebff-e298-4b55-9fad-961a85324d48',
    orderby: 1,
  },
];
function getMenu(req, res) {
  const params = req.params;
  const menuReq = menu.find(element => element.name === params.menu);
  const menugroupReq = menugroup.filter(element => element.menuid === menuReq.menuid);
  let menuItemReq = [];
  menugroupReq.forEach(element => {
    let obj = menuItem.find(value => value.menuitemid === element.menuitemid);
    menuItemReq.push(obj);
  });
  return res.json({ status: 'ok', data: menuItemReq });
}

export default {
  'GET /api/menu/getmenu/:menu': getMenu,
};
