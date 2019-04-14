/* eslint-disable import/order */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */

const about = require('./website.config').default;
const express = require('express');

function getabout(req, res) {
  return res.json({ status: 'ok', data: about.About });
}
function getlogin(req, res) {
  return res.json({ status: 'ok', data: about.LoginPage });
}

const router = express.Router();
router.get('/getabout', getabout);
router.get('/getlogin', getlogin);
module.exports = router;
