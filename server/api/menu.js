const async = require('async');
const request = require('request'); // eslint-disable-line
const express = require('express');

const models = require('../settings');

// const Uuid = models.datatypes.Uuid;

function getMenu(req, res) {
  const { params } = req;
  async.series(
    [
      callback => {
        try {
          models.instance.menu.find(
            {},
            { materialized_view: 'view_menu1', raw: true },
            (err, menu) => {
              callback(err, menu);
              // if(menu && menu.length > 0) callback(err, menu);
              // return res.json({status: "error_menu"});
            }
          );
        } catch (e) {
          console.log(e);
        }
      },
      callback => {
        try {
          models.instance.menuGroup.find(
            {},
            { materialized_view: 'view_menu_group1', raw: true },
            (err, menuGroup) => {
              callback(err, menuGroup);
              // if(menuGroup && menuGroup.length > 0) callback(err, menuGroup);
              // return res.json({status: "error_menu_group"});
            }
          );
        } catch (e) {
          console.log(e);
        }
      },
      callback => {
        try {
          models.instance.menuItem.find(
            {},
            { materialized_view: 'view_menu_item1', raw: true },
            (err, menuItem) => {
              callback(err, menuItem);
              // if(menuItem && menuItem.length > 0 ) callback(err, menuItem);
              // return res.json({status: "error_menu_item"});
            }
          );
        } catch (e) {
          console.log(e);
        }
      },
    ],
    (err, result) => {
      console.log(params, result);
      const rs = [];
      if (err) return res.json({ status: 'error' });

      return res.json({
        status: 'ok',
        data: rs,
      });
    }
  );
}
const router = express.Router();
router.get('/getmenu/:menu', getMenu);
module.exports = router;
