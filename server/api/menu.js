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
// eslint-disable-next-line import/order
const express = require('express');

const jwtpublic = fs.readFileSync('./ssl/jwtpublic.pem', 'utf8');
const jwtprivate = fs.readFileSync('./ssl/jwtprivate.pem', 'utf8');

function getMenu(req, res) {
  const params = req.params;
  let menuReq = {};
  let menugroupReq = [];
  let menuItemReq = [];

  async.series(
    [
      callback => {
        try {
          models.instance.menu.find({}, {}, function(err, menu) {
            if (menu && menu.length > 0) {
              menuReq = menu.find(element => element.name === params.menu);
            } else {
              return res.json({
                status: 'error',
              });
            }
            callback(err, null);
          });
        } catch (e) {
          console.log(e);
        }
      },
      callback => {
        try {
          models.instance.menuGroup.find({}, {}, function(err, menugroup) {
            if (menugroup && menugroup.length > 0) {
              menugroupReq = menugroup.filter(
                element => element.menuid.toString() === menuReq.menuid.toString()
              );
            } else {
              return res.json({
                status: 'error',
              });
            }
            callback(err, null);
          });
        } catch (e) {
          console.log(e);
        }
      },
      callback => {
        try {
          models.instance.menuItem.find({}, {}, function(err, menuitem) {
            if (menuitem && menuitem.length > 0) {
              menugroupReq.forEach((element, index) => {
                let obj = menuitem.find(
                  value => value.menuitemid.toString() === element.menuitemid.toString()
                );
                menuItemReq.push(obj);
              });
              callback(err, null);
            } else {
              return res.json({
                status: 'error',
              });
            }
          });
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
const router = express.Router();
router.get('/getmenu/:menu', getMenu);
module.exports = router;
