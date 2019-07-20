const async = require('async');
const fs = require('fs');
// const driver = require('cassandra-driver');
// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const request = require('request'); // eslint-disable-line
const express = require('express');
const moment = require('moment');
const models = require('../settings');
// const Uuid = models.datatypes.Uuid;

const jwtpublic = fs.readFileSync('./ssl/jwtpublic.pem', 'utf8');
const verifyOptions = {
  expiresIn: '30d',
  algorithm: ['RS256'],
};
/**
 * Search Member, Users active api/DATA/DT?{query}
 * query page,date,radio,gender,sort
 * return list of member and users filter sorted
 */

function getMembers(req, res) {
  const token = req.headers['x-access-token'];
  const { query } = req;
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
      e.timeup = e.created;
    });

    let rs = [];
    if (members && users) {
      rs = jsonMembers.concat(jsonUser);
    } else if (users) {
      rs = jsonUser;
    } else {
      rs = jsonMembers;
    }
    // Filter and sort result

    const { radio, gender, sort, date } = query;

    let listMember = rs.filter(e => {
      if (radio === 'ALL') return e;
      if (radio === 'VALID') return e.id !== undefined;
      return e.location === radio;
    });
    listMember = listMember.filter(e => {
      if (gender === 'ALL') return e;
      return e.gender.toUpperCase() === gender.toUpperCase();
    });
    // const defaultSort=listMember;
    if (sort === 'newest') {
      listMember.sort((e, f) => {
        const eTime = new Date(e.timeup).getTime();
        const jTime = new Date(f.timeup).getTime();
        return jTime - eTime;
      });
    }
    if (sort === 'special') {
      listMember = listMember.filter(e => e.species && e.species === 1);
    }
    if (sort === 'default') {
      listMember.sort((e, f) => {
        console.log(e.timeup, f.timeup);
        const eTime = new Date(e.timeup).getTime();
        const jTime = new Date(f.timeup).getTime();
        return jTime - eTime;
      });
    }
    if (date) {
      listMember = listMember.filter(e => {
        const eDate = moment(e.timeup).format('DD_MM_YYYY');
        return eDate === date;
      });
    }

    return res.json({
      status: 'ok',
      data: listMember,
    });
  });
}
const router = express.Router();
router.get('/DT', getMembers);
module.exports = router;
