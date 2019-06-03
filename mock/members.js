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

let members = [
  {
    membersid: '86164082-4a07-4c47-8669-031eb7532928',
    ucode: 94,
    gcode: 10004,
    name: 'Nguyễn Thị D',
    day: 1,
    month: 1,
    year: 2019,
    audio: '12c19ca6-da4f-42e3-a57d-b3e86c9a70a5',
    location: 'HCM',
    description: null,
    job: 'May',
    relationship: 'SINGLE',
    address: 'Cần Thơ',
    mobile: '31204102',
    gender: 'MALE',
    timeup: '2019-03-20T02:31:36.189Z',
    createat: '2019-03-26T02:31:43.445Z',
    createby: null,
  },
  {
    membersid: '44f2350d-8f6e-4434-bb90-fda5dd6a6dba',
    ucode: 12313,
    gcode: 10003,
    name: 'Nguyễn Văn C',
    day: 1,
    month: 1,
    year: 2019,
    audio: '10879fed-a31f-4edf-9857-209f80e4e9c6',
    location: 'HCM',
    description: null,
    job: 'Bán Hàng',
    relationship: 'SINGLE',
    address: 'Đồng Nai',
    mobile: '373962095',
    gender: 'MALE',
    timeup: '2019-03-20T02:25:27.134Z',
    createat: '2019-03-26T02:25:34.176Z',
    createby: null,
  },
  {
    membersid: '0da57092-5432-425e-9101-d87db1974d64',
    ucode: 2,
    gcode: 10001,
    name: 'Nguyễn Văn B',
    day: 1,
    month: 1,
    year: 2019,
    audio: 'a75d9507-d13f-43b4-a047-d761522f47e2',
    location: 'HN',
    description: null,
    job: 'Kỹ sư',
    relationship: 'SINGLE',
    address: 'Hà Nội',
    mobile: '123124412',
    gender: 'MALE',
    timeup: '2019-03-23T02:23:56.917Z',
    createat: '2019-03-26T02:24:04.383Z',
    createby: null,
  },
  {
    membersid: 'd66225b6-0690-43d9-b925-da7d3dd4a144',
    ucode: 123,
    gcode: 10000,
    name: 'Nguyễn Hữu Trí',
    day: 1,
    month: 1,
    year: 2019,
    audio: '99524708-1d7b-4fda-973c-7fe636c95eb5',
    location: 'HN',
    description: null,
    job: 'Bác Sỹ',
    relationship: 'SINGLE',
    address: 'Hà Nội',
    mobile: '373962095',
    gender: 'MALE',
    timeup: '2019-03-25T10:41:06.717Z',
    createat: '2019-03-25T10:41:13.466Z',
    createby: null,
  },
  {
    membersid: 'c0582999-4b4f-4681-b638-73176d99e825',
    ucode: 313,
    gcode: 10002,
    name: 'Nguyễn Văn B',
    day: 1,
    month: 1,
    year: 2019,
    audio: '2df91d34-e125-4079-bc90-a174fb47646f',
    location: 'HCM',
    description: null,
    job: 'Công Nhân',
    relationship: 'SINGLE',
    address: 'Hà Nội',
    mobile: '212313123',
    gender: 'FEMALE',
    timeup: '2019-03-18T02:24:35.015Z',
    createat: '2019-03-26T02:24:47.215Z',
    createby: null,
  },
];

function getMembers(req, res) {
  let result = [];
  const tasks = [
    function findMembers(callback) {
      try {
        result = members;
        callback(null, null);
      } catch (error) {
        console.log(error);
        callback(null, null);
        return res.send({ status: 'error' });
      }
    },
  ];
  async.series(tasks, err => {
    if (err) {
      console.log(err);
      return res.json({ status: 'error' });
    }
    return res.json({
      status: 'ok',
      data: result,
    });
  });
}

export default {
  'GET /api/members/getmembers': getMembers,
};
