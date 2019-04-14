/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */

const about = require('./website.config').default;

function getabout(req, res) {
  return res.json({ status: 'ok', data: about.About });
}
function getlogin(req, res) {
  return res.json({ status: 'ok', data: about.LoginPage });
}
export default {
  'GET /api/about/getabout': getabout,
  'GET /api/about/getlogin': getlogin,
};
