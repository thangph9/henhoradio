/* eslint-disable camelcase */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
import { uuidFromString } from 'express-cassandra';

const async = require('async');
const fs = require('fs');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const request = require('request'); // eslint-disable-line
/* eslint-disable prefer-destructuring */
const router = express.Router();
const jwtpublic = fs.readFileSync('./ssl/jwtpublic.pem', 'utf8');
const jwtprivate = fs.readFileSync('./ssl/jwtprivate.pem', 'utf8');
const models = require('../settings');

const Uuid = models.datatypes.Uuid;
const MESSAGE = {
  USER_NOT_MATCH: 'Tài khoản hoặc mật khẩu không đúng',
  USER_NOT_FOUND: 'Tài khoản này không tồn tại!',
  USER_HAD_BANNED: 'Tài khoản đang bị khoá',
  SYSTEM_BUSY: 'Hệ thống bận!',
  PAYMENT_NOT_SEND_OTP: 'Bạn chưa nhắn tin xác thực! Hãy nhắn tin tới tổng đài.',
  PAYMENT_OTP_OK: 'Xác thực thành công!',
  PAYMENT_OTP_WRONG: 'OTP không chính xác.',
  USER_EXISTS: 'Tài khoản đã được sử dụng',
  CONFIRM_TOKEN: 'Vui lòng kiểm tra Email của bạn để xác thực tài khoản',
};

function register(req, res) {
  const params = req.body;
  const userId = Uuid.random();
  const saltRounds = 10;
  const queries = [];
  let token = '';
  const PARAM_IS_VALID = {};
  let verificationUrl = '';
  let salt = '';
  let hash = '';
  const tasks = [
    function validParams(callback) {
      try {
        PARAM_IS_VALID.phone = params.phone;
        PARAM_IS_VALID.gender = params.gender;
        PARAM_IS_VALID.fullname = params.fullname;
        PARAM_IS_VALID.address = params.address;
        PARAM_IS_VALID.password = params.password;
        PARAM_IS_VALID.user_id = userId;
        PARAM_IS_VALID.dob_day = params.dob_day;
        PARAM_IS_VALID.dob_month = params.dob_month;
        PARAM_IS_VALID.dob_year = params.dob_year;
        callback(null, null);
      } catch (error) {
        res.send({ status: 'invalid' });
      }
    },
    function checkCaptcha(callback) {
      if (!params.captcha) {
        return res.json({
          status: 'error',
          message: 'Chưa nhập captcha',
          timeline: new Date().getTime(),
        });
      }
      verificationUrl = 'https://www.google.com/recaptcha/api/siteverify?secret=6LfUm5AUAAAAAC8xSPAt0pRUzUd4ZaK-1rZs-Aqm&response='.concat(
        params.captcha,
        '&remoteip=',
        req.connection.remoteAddress
      );
      callback(null, verificationUrl);
    },
    function verifyCaptcha(callback) {
      request(verificationUrl, (error, response, b) => {
        const body = JSON.parse(b);
        if (body.success === false) {
          return res.json({
            status: 'error',
            message: 'Sai captcha',
            timeline: new Date().getTime(),
          });
        }
        callback(error, null);
      });
    },
    function genSaltToken(callback) {
      bcrypt.genSalt(saltRounds, (err, rs) => {
        salt = rs;
        callback(err, null);
      });
    },
    function getHashToken(callback) {
      bcrypt.hash(PARAM_IS_VALID.password, salt, (err, rs) => {
        hash = rs;
        callback(err, null);
      });
    },
    function fetchPassword(callback) {
      try {
        models.instance.login.find({ phone: PARAM_IS_VALID.phone }, function(err, _phone) {
          if (_phone !== undefined && _phone.length > 0) {
            return res.json({
              status: 'error',
              message: 'Số điện thoại đã được đăng ký!',
              timeline: new Date().getTime(),
            });
          }
          callback(err, null);
        });
      } catch (error) {
        console.log(error);
        res.send({ status: 'error' });
      }
    },
    function saveUser(callback) {
      try {
        const userObject = {
          user_id: PARAM_IS_VALID.user_id,
          address: PARAM_IS_VALID.address,
          gender: PARAM_IS_VALID.gender,
          dob_day: PARAM_IS_VALID.dob_day,
          dob_month: PARAM_IS_VALID.dob_month,
          dob_year: PARAM_IS_VALID.dob_year,
          fullname: PARAM_IS_VALID.fullname,
          phone: PARAM_IS_VALID.phone,
          createat: new Date().getTime(),
        };
        const loginObject = {
          phone: PARAM_IS_VALID.phone,
          password: hash,
          password_hash_algorithm: 'bcrypt',
          password_salt: salt,
          user_id: PARAM_IS_VALID.user_id,
        };
        /* eslint-disable new-cap */
        const Users = () => {
          const object = userObject;
          const instance = new models.instance.users(object);
          const save = instance.save({ return_query: true });
          return save;
        };
        queries.push(Users());
        const Login = () => {
          const object = loginObject;
          const instance = new models.instance.login(object);
          const save = instance.save({ return_query: true });
          return save;
        };
        queries.push(Login());
      } catch (error) {
        console.log(error);
        res.send({ status: 'error' });
      }
      callback(null, null);
    },
    function Login(callback) {
      try {
        token = jwt.sign(
          {
            userid: PARAM_IS_VALID.user_id,
            fullname: PARAM_IS_VALID.fullname,
            phone: PARAM_IS_VALID.phone,
            address: PARAM_IS_VALID.address,
          },
          jwtprivate,
          {
            expiresIn: '30d', // expires in 30 day
            algorithm: 'RS256',
          }
        );
      } catch (e) {
        console.log(e);
        callback(null, null);
        res.send({ status: 'error' });
      }
      callback(null, null);
    },
    function doSubmit(callback) {
      models.doBatch(queries, err => {
        callback(err, null);
      });
    },
  ];
  async.series(tasks, err => {
    if (err) {
      console.log(err);
      return res.json({ status: 'error', message: err, timeline: new Date().getTime() });
    }
    return res.json({
      status: 'ok',
      token,
      timeline: new Date().getTime(),
    });
  });
}
function login(req, res) {
  const params = req.body;
  const PARAM_IS_VALID = {};
  let msg = '';
  let userInfo = [];
  let hashPassword = '';
  let token = '';
  let verificationUrl = '';
  const tasks = [
    function validParams(callback) {
      PARAM_IS_VALID.phone = params.phone;
      PARAM_IS_VALID.password = params.password;
      PARAM_IS_VALID.captcha = params.captcha;
      callback(null, null);
    },
    function checkCaptcha(callback) {
      if (!params.captcha) {
        return res.json({
          status: 'error',
          message: 'Chưa nhập captcha',
          timeline: new Date().getTime(),
        });
      }
      verificationUrl = 'https://www.google.com/recaptcha/api/siteverify?secret=6LfUm5AUAAAAAC8xSPAt0pRUzUd4ZaK-1rZs-Aqm&response='.concat(
        params.captcha,
        '&remoteip=',
        req.connection.remoteAddress
      );
      callback(null, verificationUrl);
    },
    function verifyCaptcha(callback) {
      request(verificationUrl, (error, response, b) => {
        const body = JSON.parse(b);
        if (body.success === false) {
          return res.json({
            status: 'error',
            message: 'Sai captcha',
            timeline: new Date().getTime(),
          });
        }
        callback(error, null);
      });
    },
    function fetchUsers(callback) {
      models.instance.users.find(
        { phone: PARAM_IS_VALID.phone },
        { allow_filtering: true },
        function(err, _user) {
          if (_user && _user.length > 0) {
            userInfo = _user[0];
          } else {
            return res.json({
              status: 'error',
              message: 'Tài khoản không tồn tại!',
              timeline: new Date().getTime(),
            });
          }
          callback(err, null);
        }
      );
    },
    function fetchPassword(callback) {
      models.instance.login.find(
        { phone: PARAM_IS_VALID.phone },
        { allow_filtering: true },
        (err, _user) => {
          if (Array.isArray(_user)) {
            if (_user !== undefined && _user.length > 0) {
              hashPassword = _user[0].password;
            } else {
              msg = MESSAGE.USER_NOT_FOUND;
            }
          }
          callback(err, null);
        }
      );
    },
    function validPassword(callback) {
      if (hashPassword !== '') {
        bcrypt.compare(PARAM_IS_VALID.password, hashPassword, (err, result) => {
          if (result === false) {
            return res.json({
              status: 'error',
              message: 'Nhập sai mật khẩu',
              timeline: new Date().getTime(),
            });
          }
          callback(err, null);
        });
      } else callback(null, null);
    },
    function Login(callback) {
      try {
        token = jwt.sign(
          {
            userid: userInfo.user_id,
            fullname: userInfo.fullname,
            phone: userInfo.phone,
            address: userInfo.address,
          },
          jwtprivate,
          {
            expiresIn: '30d', // expires in 30 day
            algorithm: 'RS256',
          }
        );
      } catch (e) {
        console.log(e);
        res.send({ status: 'error' });
      }
      callback(null, null);
    },
  ];
  async.series(tasks, err => {
    if (err) {
      res.json({ status: 'error', message: msg });
    } else {
      res.json({
        status: 'ok',
        token,
        timeline: new Date().getTime(),
      });
    }
  });
}
function checkUser(req, res) {
  const params = req.params;
  const PARAM_IS_VALID = {};
  // let verificationUrl = '';
  try {
    PARAM_IS_VALID.phone = params.phone;
    models.instance.login.find({ phone: PARAM_IS_VALID.phone }, function(err, _phone) {
      if (_phone !== undefined && _phone.length > 0) {
        return res.json({
          status: 'error',
          message: 'Số điện thoại đã được đăng ký!',
          timeline: new Date().getTime(),
        });
      }
      return res.json({
        status: 'ok',
        timeline: new Date().getTime(),
      });
    });
  } catch (error) {
    console.log(error);
    res.send({ status: 'error' });
  }
}
function question(req, res) {
  let result = [];

  const tasks = [
    function findQues(callback) {
      try {
        models.instance.question.find({}, function(err, ques) {
          if (ques && ques.length > 0) {
            result = ques;
          }
          callback(err, null);
        });
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
function sendAnswer(req, res) {
  const params = req.body;
  const token = req.headers['x-access-token'];
  let queries = [];
  let PARAM_IS_VALID = {};
  const verifyOptions = {
    expiresIn: '30d',
    algorithm: ['RS256'],
  };
  let legit = {};
  const tasks = [
    function validParams(callback) {
      PARAM_IS_VALID.answer = params.answer;
      callback(null, null);
    },
    function checkUserId(callback) {
      try {
        legit = jwt.verify(token, jwtpublic, verifyOptions);
        callback(null, null);
      } catch (e) {
        callback(e, null);
        return res.send({
          status: 'error',
          message: 'Sai ma token',
        });
      }
    },
    function saveAnswer(callback) {
      try {
        PARAM_IS_VALID.answer.forEach(element => {
          const answerObject = {
            user_id: uuidFromString(legit.userid),
            question_id: uuidFromString(element.question),
            answer: element.answer,
          };
          // eslint-disable-next-line no-shadow
          const question = () => {
            const object = answerObject;
            const instance = new models.instance.profile(object);
            const save = instance.save({ return_query: true });
            return save;
          };
          queries.push(question());
        });
      } catch (error) {
        console.log(error);
        res.send({ status: 'error' });
      }
      callback(null, null);
    },
    function saveProfile(callback) {
      try {
        PARAM_IS_VALID.answer.forEach(element => {
          const profileObject = {
            user_id: uuidFromString(legit.userid),
            question_id: uuidFromString(element.question),
          };
          const profile_by_question = () => {
            const object = profileObject;
            const instance = new models.instance.profile_by_question(object);
            const save = instance.save({ return_query: true });
            return save;
          };
          queries.push(profile_by_question());
        });
      } catch (error) {
        console.log(error);
        callback(null, null);
        res.send({ status: 'error' });
      }
      callback(null, null);
    },
    function doSubmit(callback) {
      models.doBatch(queries, err => {
        callback(err, null);
      });
    },
  ];
  async.series(tasks, err => {});
  return res.json({
    status: 'ok',
    user_id: legit.userid,
    answer: params.answer,
  });
}
router.post('/register', register);
router.post('/login', login);
router.post('/sendanswer', sendAnswer);
router.post('/question', question);
router.get('/checkuser/:phone', checkUser);
module.exports = router;
