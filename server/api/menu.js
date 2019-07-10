const async = require('async');
const request = require('request'); // eslint-disable-line
const express = require('express');

const models = require('../settings');

// const Uuid = models.datatypes.Uuid;

function getMenu(req, res) {
  const { params } = req;
  console.log(params);
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
      const menu = result[0];
      const menuGroup = result[1];
      const menuItem = result[2];
      const listItem = [];

      const newGrp = menuGroup.filter(e => e.menu_id.toString() === menu[0].id.toString());
      newGrp.forEach((e, i) => {
        const j = menuItem.find(k => e.item_id.toString() === k.id.toString());
        j.orderby = e.orderby;
        listItem[i] = j;
      });
      if (err) return res.json({ status: 'error' });
      return res.json({
        status: 'ok',
        data: listItem,
      });
    }
  );
}
const router = express.Router();
router.get('/getmenu/:menu', getMenu);
module.exports = router;
