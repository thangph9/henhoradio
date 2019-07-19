const async = require('async');
const fs = require('fs');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const request = require('request'); // eslint-disable-line
const router = express.Router();

const jwtpublic = fs.readFileSync('./ssl/jwtpublic.pem', 'utf8');
const jwtprivate = fs.readFileSync('./ssl/jwtprivate.pem', 'utf8');
const models = require('../settings');

const Uuid = models.datatypes.Uuid; // eslint-disable-line
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
  const created = new Date();
  const tasks = [
    function validParams(callback) {
      try {
        PARAM_IS_VALID.phone = params.phone;
        PARAM_IS_VALID.gender = params.gender.toUpperCase();
        PARAM_IS_VALID.fullname = params.fullname;
        PARAM_IS_VALID.address = params.address;
        PARAM_IS_VALID.password = params.password;
        PARAM_IS_VALID.id = userId;
        PARAM_IS_VALID.dob_day = params.dob_day;
        PARAM_IS_VALID.dob_month = params.dob_month;
        PARAM_IS_VALID.dob_year = params.dob_year;
        PARAM_IS_VALID.useCaptcha = params.useCaptcha;
        callback(null, null);
      } catch (error) {
        console.log(error);
      }
    },
    function checkCaptcha(callback) {
      if (PARAM_IS_VALID.useCaptcha) {
        if (!params.captcha) {
          callback(null, params.captcha);
        } else {
          verificationUrl = 'https://www.google.com/recaptcha/api/siteverify?secret=6LfUm5AUAAAAAC8xSPAt0pRUzUd4ZaK-1rZs-Aqm&response='.concat(
            params.captcha,
            '&remoteip=',
            req.connection.remoteAddress
          );
          callback(null, verificationUrl);
        }
      } else {
        callback(null, null);
      }
    },
    function verifyCaptcha(callback) {
      if (PARAM_IS_VALID.useCaptcha) {
        request(verificationUrl, (error, response, b) => {
          const body = JSON.parse(b);
          callback(error, body.success);
        });
      } else {
        callback(null, null);
      }
    },
    function genSaltToken(callback) {
      bcrypt.genSalt(saltRounds, (err, rs) => {
        salt = rs;
        callback(err, rs);
      });
    },
    function getHashToken(callback) {
      bcrypt.hash(PARAM_IS_VALID.password, salt, (err, rs) => {
        hash = rs;
        callback(err, rs);
      });
    },
    function fetchPassword(callback) {
      try {
        models.instance.login.find(
          { phone: PARAM_IS_VALID.phone },
          { materialized_view: 'view_login', raw: true },
          (err, phone) => {
            callback(err, phone);
          }
        );
      } catch (error) {
        console.log(error);
      }
    },
    function saveUser(callback) {
      try {
        const userObject = {
          id: PARAM_IS_VALID.id,
          address: PARAM_IS_VALID.address,
          gender: PARAM_IS_VALID.gender,
          dob_day: PARAM_IS_VALID.dob_day,
          dob_month: PARAM_IS_VALID.dob_month,
          dob_year: PARAM_IS_VALID.dob_year,
          fullname: PARAM_IS_VALID.fullname,
          phone: PARAM_IS_VALID.phone,
          created,
        };
        const loginObject = {
          phone: PARAM_IS_VALID.phone,
          password: hash,
          password_hash_algorithm: 'bcrypt',
          password_salt: salt,
          rule: ['Member'],
          user_id: PARAM_IS_VALID.id,
          created,
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
      }
      callback(null, null);
    },
    function Login(callback) {
      try {
        token = jwt.sign(
          {
            userid: PARAM_IS_VALID.id,
            phone: PARAM_IS_VALID.phone,
            created,
          },
          jwtprivate,
          {
            expiresIn: '30d', // expires in 30 day
            algorithm: 'RS256',
          }
        );
      } catch (e) {
        console.log(e);
      }
      callback(null, null);
    },
    function submit(callback) {
      models.doBatch(queries, err => {
        callback(err);
      });
    },
  ];
  async.series(tasks, err => {
    if (err) return res.json({ status: 'error', message: err, timeline: new Date().getTime() });
    return res.json({
      status: 'ok',
      token,
      rule: ['Member'],
      timeline: new Date().getTime(),
    });
  });
}
function login(req, res) {
  const params = req.body;
  const PARAM_IS_VALID = {};
  const msg = '';
  let verificationUrl = '';
  const tasks = [
    function validParams(callback) {
      PARAM_IS_VALID.phone = params.phone;
      PARAM_IS_VALID.password = params.password;
      PARAM_IS_VALID.captcha = params.captcha;
      PARAM_IS_VALID.useCaptcha = params.useCaptcha;
      callback(null, null);
    },
    function checkCaptcha(callback) {
      if (PARAM_IS_VALID.useCaptcha) {
        if (!params.captcha) {
          callback(null, null);
        } else {
          verificationUrl = 'https://www.google.com/recaptcha/api/siteverify?secret=6LfUm5AUAAAAAC8xSPAt0pRUzUd4ZaK-1rZs-Aqm&response='.concat(
            params.captcha,
            '&remoteip=',
            req.connection.remoteAddress
          );
          callback(null, verificationUrl);
        }
      }
      callback(null, null);
    },
    function verifyCaptcha(callback) {
      if (PARAM_IS_VALID.useCaptcha) {
        request(verificationUrl, (error, response, b) => {
          const body = JSON.parse(b);
          callback(error, body.success);
        });
      } else {
        callback(null, null);
      }
    },
    function fetchPassword(callback) {
      models.instance.login.find(
        { phone: PARAM_IS_VALID.phone },
        { materialized_view: 'view_login', raw: true },
        (err, lg) => {
          callback(err, lg);
        }
      );
    },
  ];
  async.series(tasks, (err, result) => {
    if (err) res.json({ status: 'error', message: msg });
    else {
      try {
        const userLogin = result[3][0];
        bcrypt.compare(PARAM_IS_VALID.password, userLogin.password, (e, rs) => {
          if (e)
            res.json({
              status: 'error',
              message: 'Tài khoản hoặc mật khẩu không đúng!',
              timeline: new Date().getTime(),
            });
          else if (!rs)
            res.json({
              status: 'error',
              message: 'Tài khoản hoặc mật khẩu không đúng!',
              timeline: new Date().getTime(),
            });
          else {
            const token = jwt.sign(
              {
                userid: userLogin.user_id,
                phone: userLogin.phone,
                created: userLogin.created,
              },
              jwtprivate,
              {
                expiresIn: '30d', // expires in 30 day
                algorithm: 'RS256',
              }
            );
            res.json({
              status: 'ok',
              token,
              rule: userLogin.rule,
              timeline: new Date().getTime(),
            });
          }
        });
      } catch (e) {
        console.log(e);
      }
    }
  });
}
function checkUser(req, res) {
  const { params } = req;
  const PARAM_IS_VALID = {};
  // let verificationUrl = '';
  PARAM_IS_VALID.phone = params.phone;
  async.series(
    [
      function findPhone(callback) {
        models.instance.login.find(
          { phone: PARAM_IS_VALID.phone },
          { materialized_view: 'view_login', raw: true },
          (err, phone) => {
            callback(err, phone);
            // console.log(err, phone);
          }
        );
      },
    ],
    (err, result) => {
      if (err) res.json({ status: 'error', message: '' });
      else if (result && result[0] && result[0].length > 0)
        res.json({
          status: 'error',
          message: 'Số điện thoại đã được đăng ký, mời bạn chọn số khác!',
        });
      else res.json({ status: 'ok' });
    }
  );
}
function question(req, res) {
  const result = [];

  const tasks = [
    function findQues(callback) {
      try {
        models.instance.question.find({}, (err, ques) => {
          callback(err, ques);
        });
      } catch (e) {
        console.log(e);
      }
    },
  ];
  async.series(tasks, err => {
    if (err) return res.json({ status: 'error' });
    return res.json({
      status: 'ok',
      data: result,
    });
  });
}
function sendAnswer(req, res) {
  const params = req.body;
  const token = req.headers['x-access-token'];
  const queries = [];
  const PARAM_IS_VALID = {};
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
        callback(null, legit);
      } catch (e) {
        console.log(e);
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
            const instance = new models.instance.profile(answerObject);
            const save = instance.save({ return_query: true });
            return save;
          };
          queries.push(question());
        });
      } catch (e) {
        console.log(e);
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
          const profileByQuestion = () => {
            const object = profileObject;
            const instance = new models.instance.profile_by_question(object);
            const save = instance.save({ return_query: true });
            return save;
          };
          queries.push(profileByQuestion());
        });
      } catch (e) {
        console.log(e);
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
    if (err) return res.json({ status: 'error' });
    return res.json({
      status: 'ok',
      timeline: new Date().getTime(),
    });
  });
}
function getUser(req, res) {
  const result = {};
  let legit = {};
  const token = req.headers['x-access-token'];
  // let question = [];
  const title = [];
  const group = [];
  const message = '';
  const verifyOptions = {
    expiresIn: '30d',
    algorithm: ['RS256'],
  };
  async.series(
    [
      function decodeToken(callback) {
        try {
          legit = jwt.verify(token, jwtpublic, verifyOptions);
          callback(null, legit);
        } catch (e) {
          console.log(e);
        }
      },
      function findUser(callback) {
        try {
          models.instance.users.find({ id: models.uuidFromString(legit.userid) }, (err, user) => {
            callback(err, user);
          });
        } catch (e) {
          console.log(e);
        }
      },
      function findProfile(callback) {
        try {
          models.instance.profile.find(
            { user_id: models.uuidFromString(legit.userid) },
            { select: ['question_id', 'answer'] },
            (err, results) => {
              callback(err, results);
            }
          );
        } catch (e) {
          console.log(e);
        }
      },
      function findQuestion(callback) {
        try {
          models.instance.question.find({}, (err, results) => {
            callback(err, results);
          });
        } catch (e) {
          console.log(e);
        }
      },
      function findGroup(callback) {
        try {
          models.instance.group.find({}, (err, results) => {
            callback(err, results);
          });
        } catch (error) {
          console.log(error);
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
  const PARAM_IS_VALID = {};
  const verifyOptions = {
    expiresIn: '30d',
    algorithm: ['RS256'],
  };
  async.series(
    [
      function init(callback) {
        PARAM_IS_VALID.question_id = req.body.question_id;
        PARAM_IS_VALID.answer = req.body.answer;
        callback(null, null);
      },
      function verify(callback) {
        try {
          legit = jwt.verify(token, jwtpublic, verifyOptions);
        } catch (e) {
          console.log(e);
        }
        callback(null, legit);
      },
      function updateAnswer(callback) {
        const updateObject = {
          answer: PARAM_IS_VALID.answer,
        };
        models.instance.profile.update(
          {
            user_id: models.uuidFromString(legit.userid),
            question_id: models.uuidFromString(PARAM_IS_VALID.question_id),
          },
          updateObject,
          { if_exist: true },
          err => {
            callback(err, null);
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
  const result = {};
  let legit = {};
  const token = req.headers['x-access-token'];
  const verifyOptions = {
    expiresIn: '30d',
    algorithm: ['RS256'],
  };
  async.series(
    [
      function verify(callback) {
        try {
          legit = jwt.verify(token, jwtpublic, verifyOptions);
        } catch (e) {
          console.log(e);
        }
        callback(null, legit);
      },
      function findUser(callback) {
        try {
          models.instance.users.find({}, (err, user) => {
            callback(err, user);
          });
        } catch (error) {
          console.log(error);
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
  const result = {};
  let legit = {};
  // const question = [];
  const title = [];
  let care = false;
  const group = [];
  const message = '';
  let userid = '';
  const yourQuestion = [];
  const token = req.headers['x-access-token'];
  const verifyOptions = {
    expiresIn: '30d',
    algorithm: ['RS256'],
  };
  const { params } = req;
  async.series(
    [
      function verify(callback) {
        try {
          legit = jwt.verify(token, jwtpublic, verifyOptions);
          callback(null, legit);
        } catch (e) {
          console.log(e);
        }
      },
      function process(callback) {
        try {
          const { id } = params;
          const uuid = `${id.substring(0, 8)}-${id.substring(8, 12)}-${id.substring(
            12,
            16
          )}-${id.substring(16, 20)}-${id.substring(20, 32)}`;
          userid = models.uuidFromString(uuid);
        } catch (e) {
          console.log(e);
        }
        callback(null, null);
      },
      function findUsers(callback) {
        try {
          models.instance.users.find(
            { id: userid },
            { materialized_view: 'view_users', raw: true },
            (err, user) => {
              callback(err, user);
            }
          );
        } catch (error) {
          console.log(error);
        }
      },
      function findProfile(callback) {
        try {
          models.instance.profile.find(
            { user_id: userid },
            { select: ['question_id', 'answer'] },
            (err, results) => {
              callback(err, results);
            }
          );
        } catch (error) {
          console.log(error);
        }
      },
      function processProfile(callback) {
        if (legit.userid) {
          try {
            models.instance.profile.find(
              { user_id: models.uuidFromString(legit.userid) },
              { select: ['question_id', 'answer'] },
              (err, results) => {
                callback(err, results);
              }
            );
          } catch (e) {
            console.log(e);
          }
        } else {
          callback(null, null);
        }
      },
      function findQuestion(callback) {
        try {
          models.instance.question.find({}, (err, results) => {
            callback(err, results);
          });
        } catch (error) {
          console.log(error);
        }
      },
      function findGroup(callback) {
        try {
          models.instance.group.find({}, (err, results) => {
            callback(err, results);
          });
        } catch (error) {
          console.log(error);
        }
      },
      function findUserCare(callback) {
        try {
          if (legit.userid) {
            models.instance.userCare.find(
              { user_id1: models.uuidFromString(legit.userid), user_id2: userid },
              (err, results) => {
                if (results && results.length > 0) {
                  care = true;
                }
                callback(err, null);
              }
            );
          } else {
            care = undefined;
            callback(null, null);
          }
        } catch (error) {
          console.log(error);
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
          yourQuestion,
          timeline: new Date().getTime(),
          care,
        },
      });
    }
  );
}
function updateProfileUser(req, res) {
  let legit = {};
  const token = req.headers['x-access-token'];
  const params = req.body;
  const PARAM_IS_VALID = {};
  const verifyOptions = {
    expiresIn: '30d',
    algorithm: ['RS256'],
  };
  async.series(
    [
      function init(callback) {
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
        PARAM_IS_VALID.hobbys = {
          hobbys: params.hobbys,
        };
        PARAM_IS_VALID.assets = {
          assets: params.assets,
        };
        PARAM_IS_VALID.dob_month = params.monthinfo;
        PARAM_IS_VALID.weight = params.weight;
        PARAM_IS_VALID.dob_year = params.yearinfo;
        callback(null, null);
      },
      function verify(callback) {
        try {
          legit = jwt.verify(token, jwtpublic, verifyOptions);
          callback(null, null);
        } catch (e) {
          console.log(e);
        }
      },
      function updateProfile(callback) {
        try {
          const updateObject = {
            address: PARAM_IS_VALID.address,
            avatar: PARAM_IS_VALID.avatar ? models.uuidFromString(PARAM_IS_VALID.avatar) : null,
            dob_day: PARAM_IS_VALID.dob_day,
            dob_month: PARAM_IS_VALID.dob_month,
            dob_year: PARAM_IS_VALID.dob_year,
            education: PARAM_IS_VALID.education,
            fullname: PARAM_IS_VALID.fullname,
            gender: PARAM_IS_VALID.gender,
            height: PARAM_IS_VALID.height.toString(),
            jobs: PARAM_IS_VALID.jobs,
            hobbys: PARAM_IS_VALID.hobbys,
            assets: PARAM_IS_VALID.assets,
            weight: PARAM_IS_VALID.weight.toString(),
            hometown: params.hometown,
            vov: params.vov,
            location: params.location,
            marriage: params.marriage,
            active_friend: params.active_friend,
            user_id: models.uuidFromString(legit.userid),
            created: legit.created,
          };
          const userModify = new models.instance.userModify(updateObject);
          userModify.save(err => {
            callback(err, null);
          });
        } catch (e) {
          console.log(e);
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
  const params = req.body;
  const PARAM_IS_VALID = {};
  let hashPassword = '';
  let salt = '';
  let hash = '';
  let msg = '';
  const saltRounds = 10;
  const queries = [];
  const token = req.headers['x-access-token'];
  const verifyOptions = {
    expiresIn: '30d',
    algorithm: ['RS256'],
  };
  let legit = {};
  try {
    legit = jwt.verify(token, jwtpublic, verifyOptions);
  } catch (e) {
    console.log(e);
  }
  async.series(
    [
      function init(callback) {
        PARAM_IS_VALID.password = params.password;
        PARAM_IS_VALID.newpassword = params.newpassword;
        callback(null, null);
      },
      function findLogin(callback) {
        models.instance.login.find(
          { phone: legit.phone },
          { materialized_view: 'view_login', raw: true },
          (err, _user) => {
            if (_user !== undefined && _user.length > 0) {
              hashPassword = _user[0].password;
            } else {
              msg = MESSAGE.USER_NOT_FOUND;
            }
            callback(err, null);
          }
        );
      },
      function validPassword(callback) {
        if (hashPassword !== '') {
          bcrypt.compare(PARAM_IS_VALID.password, hashPassword, (err, result) => {
            callback(err, result);
          });
        } else callback(null, null);
      },
      function genSaltChange(callback) {
        bcrypt.genSalt(saltRounds, (err, s) => {
          salt = s;
          callback(err, null);
        });
      },
      function genHashChange(callback) {
        bcrypt.hash(params.newpassword, salt, (err, h) => {
          hash = h;
          callback(err, null);
        });
      },
      function changePassword(callback) {
        try {
          const updatePasswordObject = {
            password: hash,
            password_salt: salt,
          };
          const updatePassword = () =>
            models.instance.login.update(
              { phone: legit.phone, user_id: models.uuidFromString(legit.userid) },
              updatePasswordObject,
              { if_exist: true, return_query: true }
            );
          queries.push(updatePassword());
          callback(null, null);
        } catch (e) {
          console.log(e);
        }
      },
      function submit(callback) {
        models.doBatch(queries, e => {
          callback(e);
        });
      },
    ],
    (err, result) => {
      console.log(result, msg);
      if (err) return res.json({ status: 'error1' });
      return res.json({
        status: 'ok',
        message: 'Thay đổi mật khẩu thành công',
        timeline: new Date().getTime(),
      });
    }
  );
}
function updatePhone(req, res) {
  let legit = {};
  const token = req.headers['x-access-token'];
  const params = req.body;
  const PARAM_IS_VALID = {};
  const verifyOptions = {
    expiresIn: '30d',
    algorithm: ['RS256'],
  };
  async.series(
    [
      function init(callback) {
        PARAM_IS_VALID.phone = { '1': params.phone };
        callback(null, null);
      },
      function verify(callback) {
        try {
          legit = jwt.verify(token, jwtpublic, verifyOptions);
          callback(null, legit);
        } catch (e) {
          console.log(e);
        }
      },
      function processUpdate(callback) {
        try {
          const updateObject = {
            phones: PARAM_IS_VALID.phone,
          };
          models.instance.users.update(
            { id: models.uuidFromString(legit.userid) },
            updateObject,
            { if_exist: true },
            err => {
              callback(err, null);
            }
          );
        } catch (e) {
          console.log(e);
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
  const PARAM_IS_VALID = {};
  const verifyOptions = {
    expiresIn: '30d',
    algorithm: ['RS256'],
  };
  async.series(
    [
      function init(callback) {
        PARAM_IS_VALID.email = params.email;
        callback(null, null);
      },
      function verify(callback) {
        try {
          legit = jwt.verify(token, jwtpublic, verifyOptions);
          callback(null, legit);
        } catch (e) {
          console.log(e);
        }
      },
      function processUpdate(callback) {
        try {
          const updateObject = {
            email: PARAM_IS_VALID.email,
          };
          models.instance.users.update(
            { id: models.uuidFromString(legit.userid) },
            updateObject,
            { if_exist: true },
            err => {
              callback(err, null);
            }
          );
        } catch (e) {
          console.log(e);
        }
      },
    ],
    err => {
      if (err) return res.json({ status: 'error' });
      return res.json({ status: 'ok', timeline: new Date().getTime() });
    }
  );
}
function currentUser(req, res) {
  let legit = {};
  const token = req.headers['x-access-token'];
  const verifyOptions = {
    expiresIn: '30d',
    algorithm: ['RS256'],
  };
  async.series(
    [
      function verify(callback) {
        try {
          legit = jwt.verify(token, jwtpublic, verifyOptions);
          callback(null, legit);
        } catch (e) {
          console.log(e);
        }
      },
      function findUser(callback) {
        try {
          models.instance.users.find(
            { id: models.uuidFromString(legit.userid) },
            { materialized_view: 'view_user', raw: true },
            (err, user) => {
              callback(err, user);
            }
          );
        } catch (e) {
          console.log(e);
        }
      },
    ],
    (err, result) => {
      if (err) res.json({ status: 'error' });
      else {
        const rs = result[1][0];
        res.json({
          status: 'ok',
          data: rs,
          timeline: new Date().getTime(),
        });
      }
    }
  );
}
function changeCare(req, res) {
  let legit = {};
  const token = req.headers['x-access-token'];
  let userid = '';

  const params = req.body;
  const verifyOptions = {
    expiresIn: '30d',
    algorithm: ['RS256'],
  };
  async.series(
    [
      function verify(callback) {
        try {
          legit = jwt.verify(token, jwtpublic, verifyOptions);
          callback(null, legit);
        } catch (e) {
          console.log(e);
        }
      },
      function process(callback) {
        try {
          const id = params.userid;
          const uuid = `${id.substring(0, 8)}-${id.substring(8, 12)}-${id.substring(
            12,
            16
          )}-${id.substring(16, 20)}-${id.substring(20, 32)}`;
          userid = models.uuidFromString(uuid);
        } catch (e) {
          console.log(e);
        }
        callback(null, null);
      },
      function processUserCare(callback) {
        try {
          if (params.type === 'user') {
            if (params.care) {
              const object = {
                user_id1: models.uuidFromString(legit.userid),
                user_id2: userid,
                created: new Date().getTime(),
                type: params.type,
              };
              const instance = new models.instance.userCare(object);
              instance.save(err => {
                callback(err);
              });
            } else {
              const queryObject = {
                user_id1: models.uuidFromString(legit.userid),
                user_id2: userid,
              };
              models.instance.userCare.delete(queryObject, err => {
                callback(err);
              });
            }
          } else callback(null, null);
        } catch (e) {
          console.log(e);
        }
      },
      function saveWhocare(callback) {
        try {
          if (params.type === 'user') {
            if (params.care) {
              const object = {
                user_id1: models.uuidFromString(legit.userid),
                user_id2: userid,
                created: new Date().getTime(),
              };
              const instance = new models.instance.userWhoCare(object);
              instance.save(err => {
                callback(err);
              });
            } else {
              const queryObject = {
                user_id1: models.uuidFromString(legit.userid),
                user_id2: userid,
              };
              models.instance.userWhoCare.delete(queryObject, err => {
                callback(err);
              });
            }
          } else callback(null, null);
        } catch (e) {
          console.log(e);
        }
      },
      function processUpdateUserCare(callback) {
        try {
          if (params.type === 'member') {
            if (params.care) {
              const object = {
                user_id1: models.uuidFromString(legit.userid),
                user_id2: userid,
                created: new Date().getTime(),
                type: params.type,
              };
              const instance = new models.instance.userCare(object);
              instance.save(err => {
                callback(err);
              });
            } else {
              const queryObject = {
                user_id1: models.uuidFromString(legit.userid),
                user_id2: userid,
              };
              models.instance.userCare.delete(queryObject, err => {
                callback(err);
              });
            }
          } else callback(null, null);
        } catch (e) {
          console.log(e);
        }
      },
    ],
    err => {
      if (err) return res.json({ status: 'error' });
      return res.json({ status: 'ok' });
    }
  );
}
function getUserCare(req, res) {
  let legit = {};
  let result = [];
  const token = req.headers['x-access-token'];
  const arrUser = [];
  const arrMember = [];
  let arr = [];
  const verifyOptions = {
    expiresIn: '30d',
    algorithm: ['RS256'],
  };
  async.series(
    [
      function verify(callback) {
        try {
          legit = jwt.verify(token, jwtpublic, verifyOptions);
          // callback(null, legit);
        } catch (e) {
          console.log(e);
        }
        callback(null, null);
      },
      function findUserCare(callback) {
        try {
          models.instance.userCare.find(
            { user_id1: models.uuidFromString(legit.userid) },
            (err, results) => {
              if (results && results.length > 0) {
                result = results;
              }
              callback(err, null);
            }
          );
        } catch (e) {
          console.log(e);
        }
      },
      function findUser(callback) {
        try {
          const user = result.filter(v => v.type === 'user');
          console.log(user);
          /*
          if (user.length > 0) {
            user.forEach((e) => {
              models.instance.users.find({ id: e.user_id2 }, { materialized_view: 'view_user', raw: true  } , (err, results) =>{
                if (results && results.length > 0) {
                  const obj = {};
                  obj.name = results[0].fullname;
                  obj.gender = results[0].gender;
                  obj.address = results[0].address;
                  obj.age = results[0].dob_year;
                  obj.user_id = results[0].user_id;
                  obj.created = e.created;
                  obj.avatar = results[0].avatar;
                  obj.type = 'user';
                  arrUser.push(obj);
                  if (arrUser.length === user.length) {
                    callback(null, null);
                  }
                } else {
                  return res.json({
                    status: 'error',
                  });
                }
              });
            });
            //
          } else callback(null, null);
          */
          callback(null, null);
        } catch (e) {
          console.log(e);
        }
      },
      function processMember(callback) {
        try {
          const member = result.filter(v => v.type === 'member');
          console.log(member);
          /*
          if (member.length > 0) {
        
            member.forEach((e) => {
              models.instance.members.find({ membersid: e.user_id2 }, (err, results)=> {
                if (results && results.length > 0) {
                  const obj = {};
                  obj.name = results[0].name;
                  obj.gender = results[0].gender;
                  obj.address = results[0].address;
                  obj.location = results[0].location;
                  obj.user_id = results[0].membersid;
                  obj.age = results[0].year;
                  obj.gcode = results[0].gcode;
                  obj.created = e.created;
                  obj.avatar = null;
                  obj.timeup = results[0].timeup;
                  obj.type = 'member';
                  arrMember.push(obj);
                  if (arrMember.length === member.length) {
                    callback(null, null);
                  }
                } else {
                  return res.json({
                    status: 'error',
                  });
                }
              });
            });
            callback(null, null);  
          } else callback(null, null);
          */
          callback(null, null);
        } catch (e) {
          console.log(e);
        }
      },
      function mergeArr(callback) {
        arr = arrUser.concat(arrMember);
        callback(null, null);
      },
    ],
    err => {
      if (err) return res.json({ status: 'error' });
      return res.json({
        status: 'ok',
        data: arr,
      });
    }
  );
}
function getUserWhoCare(req, res) {
  let legit = {};
  const token = req.headers['x-access-token'];
  const arr = [];
  const verifyOptions = {
    expiresIn: '30d',
    algorithm: ['RS256'],
  };
  let result = [];
  async.series(
    [
      function verify(callback) {
        try {
          legit = jwt.verify(token, jwtpublic, verifyOptions);
          callback(null, legit);
        } catch (e) {
          console.log(e);
        }
      },
      function findWhoCare(callback) {
        try {
          models.instance.userWhoCare.find(
            { user_id2: models.uuidFromString(legit.userid) },
            (err, results) => {
              if (results && results.length > 0) {
                result = results;
              }
              callback(err, null);
            }
          );
        } catch (e) {
          console.log(e);
        }
      },
      function findUser(callback) {
        try {
          /*  
          if (result.length > 0) {
            
            result.forEach((e) => {
              models.instance.users.find({ user_id: e.user_id1 }, {materialized_view: 'view_user', raw: true } , (err, results) => {
                if (results && results.length > 0) {
                  const obj = {};
                  obj.name = results[0].fullname;
                  obj.gender = results[0].gender;
                  obj.address = results[0].address;
                  obj.age = results[0].dob_year;
                  obj.user_id = results[0].user_id;
                  obj.created = e.created;
                  arr.push(obj);
                  if (arr.length === result.length) {
                    callback(null, null);
                  }
                } else {
                  return res.json({
                    status: 'error',
                  });
                }
              });
            });
            // callback(null, null);  
          } else callback(null, null);
          */

          callback(null, null);
        } catch (e) {
          console.log(e);
        }
      },
    ],
    err => {
      console.log(result);
      if (err) return res.json({ status: 'error' });
      return res.json({
        status: 'ok',
        data: arr,
      });
    }
  );
}
router.post('/register', register);
router.post('/login', login);
router.post('/sendanswer', sendAnswer);
router.get('/getuser', getUser);
router.get('/current_user', currentUser);
router.get('/question', question);
router.get('/getuserbyid/:id', getUserById);
router.get('/getallusers', getAllUsers);
router.post('/updateprofilequestion', updateProfileQuestion);
router.get('/checkuser/:phone', checkUser);
router.post('/updateprofileuser', updateProfileUser);
router.post('/changepass', changePass);
router.post('/updateemail', updateEmail);
router.post('/updatephone', updatePhone);
router.post('/changecare', changeCare);
router.get('/getusercare', getUserCare);
router.get('/getuserwhocare', getUserWhoCare);
module.exports = router;
