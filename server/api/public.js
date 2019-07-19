const async = require('async');
const fs = require('fs');
// const driver = require('cassandra-driver');
// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const request = require('request'); // eslint-disable-line
const express = require('express');
const models = require('../settings');

// const Uuid = models.datatypes.Uuid;

const jwtpublic = fs.readFileSync('./ssl/jwtpublic.pem', 'utf8');
const verifyOptions = {
  expiresIn: '30d',
  algorithm: ['RS256'],
};

function getMembers(req, res) {
  const token = req.headers['x-access-token'];
  let legit = {};
  const tasks = [
    function checkAuth(callback) {
      try {
        legit = jwt.verify(token, jwtpublic, verifyOptions);
        // callback(null, legit);
        console.log(legit);
      } catch (e) {
        console.log(e);
      }
      callback(null, null);
    },
    function findMembers(callback) {
      try {
        models.instance.members.find({}, { materialized_view: 'view_member' }, (err, mems) => {
          callback(err, mems);
        });
      } catch (error) {
        console.log(error);
      }
    },
    function findAllUser(callback) {
      models.instance.users.find({}, { materialized_view: 'view_user' }, (err, users) => {
        callback(err, users);
      });
    },
  ];
  async.series(tasks, (err, result) => {
    if (err) {
      return res.json({ status: 'error' });
    }
    const members = result[1];
    const users = result[2];
    const jsonUser = JSON.parse(JSON.stringify(users));
    const jsonMembers = JSON.parse(JSON.stringify(members));
    jsonUser.forEach(e => {
      e.name = e.fullname;
      e.ucode = e.uniqueid;
      e.membersid = e.id;
    });
    let rs = [];
    if (members && users) {
      rs = jsonMembers.concat(jsonUser);
    } else if (users) {
      rs = jsonUser;
    } else {
      rs = jsonMembers;
    }

    return res.json({
      status: 'ok',
      data: rs,
    });
  });
}
const router = express.Router();
router.get('/DT', getMembers);
module.exports = router;
