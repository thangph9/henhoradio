/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef-init */
/* eslint-disable no-shadow */
/* eslint-disable camelcase */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
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
          rule: ['member'],
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
  let rule = [];
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
              rule = _user[0].rule;
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
        rule,
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
        callback(null, null);
        return res.send({ status: 'error' });
      }
    },
  ];
  async.series(tasks, err => {
    if (err) {
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
            user_id: models.uuidFromString(legit.userid),
            question_id: models.uuidFromString(element.question),
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
        res.send({ status: 'error' });
      }
      callback(null, null);
    },
    function saveProfile(callback) {
      try {
        PARAM_IS_VALID.answer.forEach(element => {
          const profileObject = {
            user_id: models.uuidFromString(legit.userid),
            question_id: models.uuidFromString(element.question),
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
    timeline: new Date().getTime(),
  });
}
function getUser(req, res) {
  let result = {};
  let legit = {};
  const token = req.headers['x-access-token'];
  let question = [];
  let title = [];
  let group = [];
  let message = '';
  const verifyOptions = {
    expiresIn: '30d',
    algorithm: ['RS256'],
  };
  async.series(
    [
      callback => {
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
      callback => {
        try {
          models.instance.users.find({ user_id: models.uuidFromString(legit.userid) }, function(
            err,
            user
          ) {
            if (user && user.length > 0) {
              result = user[0];
            } else {
              return res.json({
                status: 'error',
                message: 'Không tìm thấy tài khoản này',
              });
            }
            callback(err, null);
          });
        } catch (error) {
          console.log(error);
          res.send({ status: 'error' });
        }
      },
      callback => {
        try {
          models.instance.profile.find(
            { user_id: models.uuidFromString(legit.userid) },
            { select: ['question_id', 'answer'] },
            function(err, results) {
              if (results && results.length > 0) {
                let arr = [];
                results.forEach(element => {
                  let a = JSON.stringify(element);
                  let obj = JSON.parse(a);

                  arr.push(obj);
                });
                question = arr;
              } else {
                message = 'Chưa trả lời câu hỏi';
              }
              callback(err, null);
            }
          );
        } catch (error) {
          callback(error, null);
        }
      },
      callback => {
        try {
          models.instance.question.find({}, function(err, results) {
            if (results && results.length > 0) {
              let arr = [];
              results.forEach(element => {
                arr.push(element);
              });
              title = arr;
            }
            callback(err, null);
          });
        } catch (error) {
          callback(error);
        }
      },
      callback => {
        try {
          models.instance.group.find({}, function(err, results) {
            if (results && results.length > 0) {
              let arr = [];
              results.forEach(element => {
                arr.push(element);
              });
              group = arr;
            }
            callback(err, null);
          });
        } catch (error) {
          callback(error);
        }
      },
    ],
    err => {
      if (err) return res.json({ status: 'error' });
      return res.json({
        status: 'ok',
        data: {
          result,
          question,
          message,
          title,
          group,
          timeline: new Date().getTime(),
        },
      });
    }
  );
}
function updateProfileQuestion(req, res) {
  let legit = {};
  const token = req.headers['x-access-token'];
  let PARAM_IS_VALID = {};
  const verifyOptions = {
    expiresIn: '30d',
    algorithm: ['RS256'],
  };
  async.series(
    [
      callback => {
        PARAM_IS_VALID.question_id = req.body.question_id;
        PARAM_IS_VALID.answer = req.body.answer;
        callback(null, null);
      },
      callback => {
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
      callback => {
        let update_object = {
          answer: PARAM_IS_VALID.answer,
        };
        let object = update_object;
        models.instance.profile.update(
          {
            user_id: models.uuidFromString(legit.userid),
            question_id: models.uuidFromString(PARAM_IS_VALID.question_id),
          },
          object,
          { if_exist: true },
          function(err) {
            if (err) {
              console.log(err);
              callback(err, null);
            }
            callback(null, null);
          }
        );
      },
    ],
    err => {
      if (err) return res.json({ status: 'error' });
      return res.json({ status: 'ok', timeline: new Date().getTime() });
    }
  );
}
function getAllUsers(req, res) {
  let result = {};
  let legit = {};
  const token = req.headers['x-access-token'];
  const verifyOptions = {
    expiresIn: '30d',
    algorithm: ['RS256'],
  };
  async.series(
    [
      callback => {
        try {
          legit = jwt.verify(token, jwtpublic, verifyOptions);
          callback(null, null);
        } catch (e) {
          return res.json({
            status: 'error',
            message: 'Sai ma token',
          });
        }
      },
      callback => {
        try {
          models.instance.users.find({}, function(err, user) {
            if (user && user.length > 0) {
              let a = JSON.stringify(user);
              let b = JSON.parse(a);
              let arr = [];
              b.forEach(element => {
                let obj = {};
                obj.user_id = element.user_id;
                obj.fullname = element.fullname;
                obj.gender = element.gender;
                obj.age = new Date().getFullYear() - element.dob_year;
                obj.address = element.address;
                obj.avatar = element.avatar;
                arr.push(obj);
              });
              arr = arr.filter(element => element.user_id !== legit.userid);
              result = arr;
            } else {
              return res.json({
                status: 'error',
                message: 'Không tìm thấy tài khoản này',
              });
            }
            callback(err, null);
          });
        } catch (error) {
          console.log(error);
          res.send({ status: 'error' });
        }
      },
    ],
    err => {
      if (err) return res.json({ status: 'error' });
      return res.json({ status: 'ok', data: result });
    }
  );
}
function getUserById(req, res) {
  let result = {};
  let legit = {};
  let question = [];
  let title = [];
  let group = [];
  let message = '';
  let userid = undefined;
  let yourQuestion = [];
  const token = req.headers['x-access-token'];
  const verifyOptions = {
    expiresIn: '30d',
    algorithm: ['RS256'],
  };
  let params = req.params;
  async.series(
    [
      callback => {
        try {
          legit = jwt.verify(token, jwtpublic, verifyOptions);
          callback(null, null);
        } catch (e) {
          return res.send({
            status: 'error',
            message: 'Sai ma token',
          });
        }
      },
      function(callback) {
        try {
          let id = params.id;
          let uuid = `${id.substring(0, 8)}-${id.substring(8, 12)}-${id.substring(
            12,
            16
          )}-${id.substring(16, 20)}-${id.substring(20, 32)}`;
          userid = models.uuidFromString(uuid);
        } catch (e) {
          return res.json({ status: 'error1' });
        }
        callback(null, null);
      },
      callback => {
        try {
          models.instance.users.find({ user_id: userid }, {}, function(err, user) {
            if (user && user.length > 0) {
              result = user[0];
            } else {
              return res.json({
                status: 'error',
                message: 'Không tìm thấy tài khoản này',
              });
            }
            callback(err, null);
          });
        } catch (error) {
          console.log(error);
          res.send({ status: 'error' });
        }
      },
      callback => {
        try {
          models.instance.profile.find(
            { user_id: userid },
            { select: ['question_id', 'answer'] },
            function(err, results) {
              if (results && results.length > 0) {
                let arr = [];
                results.forEach(element => {
                  let a = JSON.stringify(element);
                  let obj = JSON.parse(a);
                  arr.push(obj);
                });
                question = arr;
              } else {
                message = 'Chưa trả lời câu hỏi';
              }
              callback(err, null);
            }
          );
        } catch (error) {
          callback(error, null);
        }
      },
      callback => {
        try {
          models.instance.profile.find(
            { user_id: models.uuidFromString(legit.userid) },
            { select: ['question_id', 'answer'] },
            function(err, results) {
              if (results && results.length > 0) {
                let arr = [];
                results.forEach(element => {
                  let a = JSON.stringify(element);
                  let obj = JSON.parse(a);
                  arr.push(obj);
                });
                yourQuestion = arr;
              } else {
                message = 'Chưa trả lời câu hỏi';
              }
              callback(err, null);
            }
          );
        } catch (error) {
          callback(error, null);
        }
      },
      callback => {
        try {
          models.instance.question.find({}, function(err, results) {
            if (results && results.length > 0) {
              let arr = [];
              results.forEach(element => {
                arr.push(element);
              });
              title = arr;
            }
            callback(err, null);
          });
        } catch (error) {
          callback(error);
        }
      },
      callback => {
        try {
          models.instance.group.find({}, function(err, results) {
            if (results && results.length > 0) {
              let arr = [];
              results.forEach(element => {
                arr.push(element);
              });
              group = arr;
            }
            callback(err, null);
          });
        } catch (error) {
          callback(error);
        }
      },
    ],
    err => {
      if (err) {
        console.log(err);
        return res.json({ status: 'error' });
      }
      return res.json({
        status: 'ok',
        data: {
          result,
          question,
          message,
          title,
          group,
          yourQuestion,
          timeline: new Date().getTime(),
        },
      });
    }
  );
}
function updateProfileUser(req, res) {
  let legit = {};
  const token = req.headers['x-access-token'];
  const params = req.body;
  let PARAM_IS_VALID = {};
  const verifyOptions = {
    expiresIn: '30d',
    algorithm: ['RS256'],
  };
  async.series(
    [
      callback => {
        PARAM_IS_VALID.address = params.address;
        PARAM_IS_VALID.avatar = params.avatar;
        PARAM_IS_VALID.dob_day = params.dateinfo;
        PARAM_IS_VALID.education = {
          education: params.education,
        };
        PARAM_IS_VALID.fullname = params.fullname;
        PARAM_IS_VALID.gender = params.gender;
        PARAM_IS_VALID.height = params.height;
        PARAM_IS_VALID.jobs = {
          jobs: params.jobs,
        };
        PARAM_IS_VALID.dob_month = params.monthinfo;
        PARAM_IS_VALID.weight = params.weight;
        PARAM_IS_VALID.dob_year = params.yearinfo;
        callback(null, null);
      },
      callback => {
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
      callback => {
        try {
          let update_object = {
            address: PARAM_IS_VALID.address,
            avatar: PARAM_IS_VALID.avatar ? models.uuidFromString(PARAM_IS_VALID.avatar) : null,
            dob_day: PARAM_IS_VALID.dob_day,
            dob_month: PARAM_IS_VALID.dob_month,
            dob_year: PARAM_IS_VALID.dob_year,
            education: PARAM_IS_VALID.education,
            fullname: PARAM_IS_VALID.fullname,
            gender: PARAM_IS_VALID.gender,
            height: PARAM_IS_VALID.height,
            jobs: PARAM_IS_VALID.jobs,
            weight: PARAM_IS_VALID.weight,
          };
          let object = update_object;
          models.instance.users.update(
            { user_id: models.uuidFromString(legit.userid) },
            object,
            { if_exist: true },
            function(err) {
              if (err) {
                console.log(err);
                return res.json({ status: 'error' });
              }
              callback(null, null);
            }
          );
        } catch (error) {
          callback(error, null);
        }
      },
    ],
    err => {
      if (err) return res.json({ status: 'error' });
      return res.json({ status: 'ok', timeline: new Date().getTime() });
    }
  );
}
function changePass(req, res) {
  let params = req.body;
  let PARAM_IS_VALID = {};
  let msg = '';
  let hashPassword = '';
  let _salt = '';
  let _hash = '';
  let saltRounds = 10;
  let queries = [];
  let token = req.headers['x-access-token'];
  let verifyOptions = {
    expiresIn: '30d',
    algorithm: ['RS256'],
  };
  let legit = {};
  try {
    legit = jwt.verify(token, jwtpublic, verifyOptions);
  } catch (e) {
    return res.send({
      status: 'error',
      message: 'Có lỗi xảy ra! vui lòng đăng nhập lại trước khi đổi mật khẩu',
    });
  }
  async.series(
    [
      function(callback) {
        PARAM_IS_VALID.password = params.password;
        PARAM_IS_VALID.newpassword = params.newpassword;
        callback(null, null);
      },
      function(callback) {
        models.instance.login.find({ phone: legit.phone }, function(err, _user) {
          if (_user !== undefined && _user.length > 0) {
            hashPassword = _user[0].password;
          } else {
            msg = MESSAGE.USER_NOT_FOUND;
          }
          callback(err, null);
        });
      },
      function(callback) {
        if (hashPassword !== '') {
          bcrypt.compare(PARAM_IS_VALID.password, hashPassword, function(err, result) {
            // res == true
            if (result === false) {
              return res.json({
                status: 'error0',
                message: 'Mật khẩu cũ không chính xác',
                timeline: new Date().getTime(),
              });
            }
            callback(err, null);
          });
        } else callback(null, null);
      },
      function(callback) {
        bcrypt.genSalt(saltRounds, function(err, salt) {
          _salt = salt;
          callback(err, null);
        });
      },
      function(callback) {
        bcrypt.hash(params.newpassword, _salt, function(err, hash) {
          _hash = hash;
          callback(err, null);
        });
      },
      function(callback) {
        try {
          let update_password_object = {
            password: _hash,
            password_salt: _salt,
          };
          let update_password = () => {
            let object = update_password_object;
            let update = models.instance.login.update(
              { phone: legit.phone, user_id: models.uuidFromString(legit.userid) },
              object,
              { if_exist: true, return_query: true }
            );
            return update;
          };
          queries.push(update_password());
          callback(null, null);
        } catch (error) {
          callback(error, null);
        }
      },
    ],
    function(err, result) {
      if (err) return res.json({ status: 'error1' });
      models.doBatch(queries, function(err) {
        if (err) {
          console.log(err);
          return res.json({ status: 'error2' });
        }
        return res.json({
          status: 'ok',
          message: 'Thay đổi mật khẩu thành công',
          timeline: new Date().getTime(),
        });
      });
    }
  );
}
function updatePhone(req, res) {
  let legit = {};
  const token = req.headers['x-access-token'];
  const params = req.body;
  let PARAM_IS_VALID = {};
  const verifyOptions = {
    expiresIn: '30d',
    algorithm: ['RS256'],
  };
  async.series(
    [
      callback => {
        PARAM_IS_VALID.phone = { '1': params.phone };
        callback(null, null);
      },
      callback => {
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
      callback => {
        try {
          let update_object = {
            phones: PARAM_IS_VALID.phone,
          };
          let object = update_object;
          models.instance.users.update(
            { user_id: models.uuidFromString(legit.userid) },
            object,
            { if_exist: true },
            function(err) {
              if (err) {
                console.log(err);
                return res.json({ status: 'error' });
              }
              callback(null, null);
            }
          );
        } catch (error) {
          callback(error, null);
        }
      },
    ],
    err => {
      if (err) return res.json({ status: 'error' });
      return res.json({ status: 'ok', timeline: new Date().getTime() });
    }
  );
}
function updateEmail(req, res) {
  let legit = {};
  const token = req.headers['x-access-token'];
  const params = req.body;
  let PARAM_IS_VALID = {};
  const verifyOptions = {
    expiresIn: '30d',
    algorithm: ['RS256'],
  };
  async.series(
    [
      callback => {
        PARAM_IS_VALID.email = params.email;
        callback(null, null);
      },
      callback => {
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
      callback => {
        try {
          let update_object = {
            email: PARAM_IS_VALID.email,
          };
          let object = update_object;
          models.instance.users.update(
            { user_id: models.uuidFromString(legit.userid) },
            object,
            { if_exist: true },
            function(err) {
              if (err) {
                console.log(err);
                return res.json({ status: 'error' });
              }
              callback(null, null);
            }
          );
        } catch (error) {
          callback(error, null);
        }
      },
    ],
    err => {
      if (err) return res.json({ status: 'error' });
      return res.json({ status: 'ok', timeline: new Date().getTime() });
    }
  );
}
function getOnlyUser(req, res) {
  let result = {};
  let legit = {};
  const token = req.headers['x-access-token'];
  const verifyOptions = {
    expiresIn: '30d',
    algorithm: ['RS256'],
  };
  async.series(
    [
      callback => {
        try {
          legit = jwt.verify(token, jwtpublic, verifyOptions);
          callback(null, null);
        } catch (e) {
          return res.send({
            status: 'error',
            message: 'Sai ma token',
          });
        }
      },
      callback => {
        try {
          models.instance.users.find({ user_id: models.uuidFromString(legit.userid) }, function(
            err,
            user
          ) {
            if (user && user.length > 0) {
              result = user[0];
            } else {
              return res.json({
                status: 'error',
                message: 'Không tìm thấy tài khoản này',
              });
            }
            callback(err, null);
          });
        } catch (error) {
          console.log(error);
          res.send({ status: 'error' });
        }
      },
    ],
    err => {
      if (err) return res.json({ status: 'error' });
      return res.json({
        status: 'ok',
        data: result,
        timeline: new Date().getTime(),
      });
    }
  );
}

router.post('/register', register);
router.post('/login', login);
router.get('/sendanswer', sendAnswer);
router.get('/getuser', getUser);
router.get('/getonlyuser', getOnlyUser);
router.get('/question', question);
router.get('/getuserbyid/:id', getUserById);
router.get('/getallusers', getAllUsers);
router.post('/updateprofilequestion', updateProfileQuestion);
router.get('/checkuser/:phone', checkUser);
router.post('/updateprofileuser', updateProfileUser);
router.post('/changepass', changePass);
router.post('/updateemail', updateEmail);
router.post('/updatephone', updatePhone);
module.exports = router;
