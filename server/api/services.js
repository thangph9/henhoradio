const async = require('async'); // eslint-disable-line
const express = require('express'); // eslint-disable-line
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

const driver = require('cassandra-driver'); // eslint-disable-line
const models = require('../settings');

const Uuid = driver.types.Uuid; // eslint-disable-line

// const jwtprivate = fs.readFileSync('./ssl/jwtprivate.pem', 'utf8');

const router = express.Router();

function fetch(req, res) {
  let users = {};
  async.series(
    [
      function initialParam(callback) {
        callback(null, null);
      },
      function getDataUser(callback) {
        models.instance.users.find({}, (err, items) => {
          users = items;
          callback(err, null);
        });
      },
    ],
    err => {
      if (err) res.send({ status: 'error' });
      res.send({ status: 'ok', data: users });
    }
  );
}
router.get('/f', fetch);

module.exports = router;
