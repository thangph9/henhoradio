/* eslint-disable no-empty */
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

let usersDemo = [
  {
    user_id: 'a0a8c0d5-88b7-4d2a-8015-51952e6748e2',
    address: 'Đông Anh - Hà Nội',
    avatar: 'cc81efc3-9957-4c15-abc5-b2845602e968',
    country: null,
    description: null,
    distance: null,
    dob_day: 27,
    dob_month: 6,
    public: 'active',
    dob_year: 1997,
    email: 'trjvjp97@gmail.com',
    fullname: 'Nguyễn Hữu Trí ',
    gender: 'male',
    height: '177',
    weight: '72',
    hhr_goal: null,
    phone: '0373962095',
    uniqueid: null,
    video: null,
    living: 'Hà Nội',
    jobs: { jobs1: 'Ở nhà', jobs2: '20000000' },
    hobbys: { hobby1: 'Đá bóng', hobby2: 'Nghe nhạc' },
    assets: { asset1: 'Nhà 3 tầng', asset2: 'BMW' },
    marriage: 'Độc thân',
    vov: true,
    location: 'VOVHN',
    activeFriend: true,
    education: { education: 'Đại học' },
    audio: null,
    phones: { '1': '0373962095' },
    createat: '2019-03-14T14:59:27.728Z',
  },
];

let loginDemo = [
  {
    phone: '0373962095',
    user_id: 'a0a8c0d5-88b7-4d2a-8015-51952e6748e2',
    password: '$2a$10$4Ju7x0SFsPyU/hrhASRpPeuR37ncNj.hkkCuQbhMWLr.KyHhD9NxO',
    password_hash_algorithm: 'bcrypt',
    password_salt: '$2a$10$4Ju7x0SFsPyU/hrhASRpPe',
    status: 'active',
    rule: ['Member'],
  },
];

let questionDemo = [
  {
    question_id: '422f932a-e578-4338-bf23-fcee7110b804',
    type: '1',
    title: 'Nơi ở hiện nay của bạn?',
    answer: null,
    group_id: '7f9572a3-8bd0-41d1-aca7-ae97426d9da5',
  },
  {
    question_id: '610c45e6-4dcd-4850-870e-215f90c85f19',
    type: '1',
    title: 'Bạn nghĩ thể nào về startup?',
    answer: null,
    group_id: 'aa3ec977-cf71-4dd1-afdb-960f3faca6cf',
  },
  {
    question_id: 'e79bb30a-50e1-4ba5-a887-7815e9d6f3f3',
    type: '2',
    title: 'Bạn có đi học đại học?',
    answer: ['Có', 'Không'],
    group_id: '3c6de2ec-7521-4990-acdf-176caa967ea3',
  },
  {
    question_id: '26eff392-319b-417a-8e21-614f077033b3',
    type: '1',
    title: 'Nhà bạn có mấy người ?',
    answer: null,
    group_id: 'aa3ec977-cf71-4dd1-afdb-960f3faca6cf',
  },
  {
    question_id: '477eb320-6085-4fc0-bbd4-f4bff0c0a284',
    type: '2',
    title: 'Bạn có hay đi xem phim ko?',
    answer: ['Có', 'Không', 'Ít đi xem'],
    group_id: '4aa1e317-b37e-4200-8e2b-bb04537bfddd',
  },
  {
    question_id: 'b1c27a09-0fc7-457a-9e62-01fe0a14c40d',
    type: '3',
    title: 'Bạn đã ra nước ngoài chưa?',
    answer: ['Chưa đi đâu cả', 'Đã đi châu Mỹ', 'Đã đi châu Á', 'Đã đi châu Âu'],
    group_id: '3c6de2ec-7521-4990-acdf-176caa967ea3',
  },
  {
    question_id: '8ddcb95e-5458-40f3-b086-897252089522',
    type: '2',
    title: 'Bạn có thích đọc sách không?',
    answer: ['Có', 'Không', 'Rất ít đọc'],
    group_id: '4aa1e317-b37e-4200-8e2b-bb04537bfddd',
  },
  {
    question_id: '9225436e-067b-4f9e-ab5c-e776ed4839a3',
    type: '1',
    title: 'Bạn cao bao nhiêu ? ',
    answer: null,
    group_id: '4aa1e317-b37e-4200-8e2b-bb04537bfddd',
  },
  {
    question_id: '69b7223a-04c2-4058-b1ca-165371d1631a',
    type: '2',
    title: 'Bạn có đeo kính ?',
    answer: ['Có', 'Không'],
    group_id: '7f9572a3-8bd0-41d1-aca7-ae97426d9da5',
  },
  {
    question_id: 'dfb0957e-b0c5-40ac-9a5c-b92cffb0b261',
    type: '2',
    title: 'Bạn có hay nghe radio?',
    answer: ['Không bao giờ', 'Thường xuyên', 'Ít khi'],
    group_id: '3c6de2ec-7521-4990-acdf-176caa967ea3',
  },
  {
    question_id: '784a526d-56e7-4872-9568-b14796bb8546',
    type: '2',
    title: 'Bạn hay đi làm bằng phương tiên gì ?',
    answer: ['Xe bus', 'Xe máy', 'Ô tô'],
    group_id: 'aa3ec977-cf71-4dd1-afdb-960f3faca6cf',
  },
  {
    question_id: '0fe56740-75b8-49de-a50d-c839703c00ff',
    type: '1',
    title: 'Bạn có đang sống cùng gia đình?',
    answer: null,
    group_id: 'aa3ec977-cf71-4dd1-afdb-960f3faca6cf',
  },
  {
    question_id: 'cbd406af-aefd-4422-8f70-bb268cdf7a1b',
    type: '2',
    title: 'Bạn có hay đi du lịch?',
    answer: ['Không đi bao giờ', 'Đi nhiều', 'Đi ít'],
    group_id: '4aa1e317-b37e-4200-8e2b-bb04537bfddd',
  },
  {
    question_id: 'eeea1051-4ad0-40b2-bba8-a02bd7a7c84f',
    type: '1',
    title: 'Nhà bạn đang ở?',
    answer: null,
    group_id: '7f9572a3-8bd0-41d1-aca7-ae97426d9da5',
  },
  {
    question_id: 'a8c7abe0-6ce2-48d0-b744-bbef9e8a9376',
    type: '1',
    title: 'Khi nào bạn kết hôn?',
    answer: null,
    group_id: '4aa1e317-b37e-4200-8e2b-bb04537bfddd',
  },
  {
    question_id: '9cb6854d-9427-4320-b0a1-2096761f4a92',
    type: '1',
    title: 'Quê gốc bạn ở đâu?',
    answer: null,
    group_id: '7f9572a3-8bd0-41d1-aca7-ae97426d9da5',
  },
  {
    question_id: 'd1928c39-d17f-4695-b30f-dc5fa2795d51',
    type: '2',
    title: 'Bạn đang có công việc ổn đinh ?',
    answer: ['Có', 'Không', 'Đang làm việc tự do'],
    group_id: '3c6de2ec-7521-4990-acdf-176caa967ea3',
  },
  {
    question_id: '7ede6586-0cb8-4af7-a970-f4786632c049',
    type: '1',
    title: 'Bạn nặng bao nhiêu ? ',
    answer: null,
    group_id: '4aa1e317-b37e-4200-8e2b-bb04537bfddd',
  },
  {
    question_id: '83ef5bd7-57e8-48ef-b631-13886af117aa',
    type: '2',
    title: 'Bạn có hay đi phượt xa cùng bạn bè?',
    answer: ['Có', 'Không', 'Ít khi'],
    group_id: '7f9572a3-8bd0-41d1-aca7-ae97426d9da5',
  },
  {
    question_id: '3aba89b9-e9d4-4dff-bdb4-c89a29e838d6',
    type: '1',
    title: 'Nêu đi du lịch thì bạn thích đến đâu nhất?',
    answer: null,
    group_id: '4aa1e317-b37e-4200-8e2b-bb04537bfddd',
  },
  {
    question_id: '09050540-dd87-4087-a46e-e01086e57678',
    type: '2',
    title: 'Bạn có thích ăn sôcola ? ',
    answer: ['Có', 'Không', 'Ít khi ăn'],
    group_id: '4aa1e317-b37e-4200-8e2b-bb04537bfddd',
  },
];

let profileDemo = [];

let profile_by_questionDemo = [];

let groupDemo = [
  { group_id: '7f9572a3-8bd0-41d1-aca7-ae97426d9da5', title: 'Nhóm group số 4' },
  { group_id: '4aa1e317-b37e-4200-8e2b-bb04537bfddd', title: 'Nhóm group số 3' },
  { group_id: '3c6de2ec-7521-4990-acdf-176caa967ea3', title: 'Nhóm group số 2' },
  { group_id: 'aa3ec977-cf71-4dd1-afdb-960f3faca6cf', title: 'Nhóm group số 1' },
];

let userCareDemo = [];
let userWhoCareDemo = [];

/* ------------------------------------------------------------------------------------------------------------------------------------------------ */
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
        PARAM_IS_VALID.useCaptcha = params.useCaptcha;
        callback(null, null);
      } catch (error) {
        res.send({ status: 'invalid' });
      }
    },
    callback => {
      if (new Date().getFullYear() - PARAM_IS_VALID.dob_year < 18) {
        return res.json({
          status: 'error2',
          message: 'Bạn chưa đủ 18 tuổi không thể tham gia hẹn hò',
          timeline: new Date().getTime(),
        });
      }
      callback(null, null);
    },
    function checkCaptcha(callback) {
      if (PARAM_IS_VALID.useCaptcha) {
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
      } else {
        callback(null, null);
      }
    },
    function verifyCaptcha(callback) {
      if (PARAM_IS_VALID.useCaptcha) {
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
      } else {
        callback(null, null);
      }
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
        let phone = loginDemo.find(ele => PARAM_IS_VALID.phone === ele.phone);
        if (phone) {
          return res.json({
            status: 'error',
            message: 'Số điện thoại đã được đăng ký!',
            timeline: new Date().getTime(),
          });
        }
        callback(null, null);
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
          height: req.body.height,
          weight: req.body.weight,
          createat: new Date().getTime(),
        };
        const loginObject = {
          phone: PARAM_IS_VALID.phone,
          password: hash,
          password_hash_algorithm: 'bcrypt',
          password_salt: salt,
          rule: ['Member'],
          user_id: PARAM_IS_VALID.user_id,
        };
        /* eslint-disable new-cap */
        usersDemo.push(userObject);
        loginDemo.push(loginObject);
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
  ];
  async.series(tasks, err => {
    if (err) {
      return res.json({ status: 'error', message: err, timeline: new Date().getTime() });
    }
    return res.json({
      status: 'ok',
      token,
      loginDemo,
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
      PARAM_IS_VALID.useCaptcha = params.useCaptcha;
      callback(null, null);
    },
    function checkCaptcha(callback) {
      if (PARAM_IS_VALID.useCaptcha) {
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
      } else {
        callback(null, null);
      }
    },
    function verifyCaptcha(callback) {
      if (PARAM_IS_VALID.useCaptcha) {
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
      } else {
        callback(null, null);
      }
    },
    function fetchUsers(callback) {
      let acc = loginDemo.find(ele => ele.phone === PARAM_IS_VALID.phone);
      if (acc) {
        userInfo = acc;
      } else {
        return res.json({
          status: 'error',
          message: 'Tài khoản không tồn tại!',
          timeline: new Date().getTime(),
        });
      }
      callback(null, null);
    },
    function fetchPassword(callback) {
      let _user = loginDemo.find(ele => ele.phone === PARAM_IS_VALID.phone);
      if (_user) {
        hashPassword = _user.password;
        rule = _user.rule;
      } else {
        msg = MESSAGE.USER_NOT_FOUND;
      }
      callback(null, null);
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
    let phone = loginDemo.find(ele => PARAM_IS_VALID.phone === ele.phone);
    if (phone) {
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
        result = questionDemo;
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
          profileDemo.push(answerObject);
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
            user_id: models.uuidFromString(legit.userid),
            question_id: models.uuidFromString(element.question),
          };
          profile_by_questionDemo.push(profileObject);
        });
      } catch (error) {
        console.log(error);
        callback(null, null);
        res.send({ status: 'error' });
      }
      callback(null, null);
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
  let question = [];
  let title = [];
  let group = [];
  let message = '';
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
          let user = usersDemo.find(ele => ele.user_id.toString() === legit.userid.toString());
          if (user) {
            result = user;
          } else {
            return res.json({
              status: 'error',
              message: 'Không tìm thấy tài khoản này',
            });
          }
          callback(null, null);
        } catch (error) {
          console.log(error);
          res.send({ status: 'error' });
        }
      },
      callback => {
        try {
          let profile = profileDemo.filter(
            ele => ele.user_id.toString() === legit.userid.toString()
          );
          if (profile) {
            let arr = [];
            profile.forEach(element => {
              let a = JSON.stringify(element);
              let obj = JSON.parse(a);

              arr.push(obj);
            });
            question = arr;
          } else {
            message = 'Chưa trả lời câu hỏi';
          }
          callback(null, null);
        } catch (error) {
          callback(error, null);
        }
      },
      callback => {
        try {
          let arr = [];
          questionDemo.forEach(element => {
            arr.push(element);
          });
          title = arr;
          callback(null, null);
        } catch (error) {
          callback(error);
        }
      },
      callback => {
        try {
          let arr = [];
          groupDemo.forEach(element => {
            arr.push(element);
          });
          group = arr;
          callback(null, null);
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
          return res.send({
            status: 'error',
            message: 'Sai ma token',
          });
        }
      },
      callback => {
        try {
          let profileIndex = profileDemo.findIndex(
            ele =>
              ele.user_id.toString() === legit.userid.toString() &&
              ele.question_id.toString() === PARAM_IS_VALID.question_id.toString()
          );
          if (profileIndex !== -1) {
            profileDemo[profileIndex] = {
              user_id: models.uuidFromString(legit.userid),
              question_id: models.uuidFromString(PARAM_IS_VALID.question_id),
              answer: PARAM_IS_VALID.answer,
            };
          } else {
            profileDemo.push({
              user_id: models.uuidFromString(legit.userid),
              question_id: models.uuidFromString(PARAM_IS_VALID.question_id),
              answer: PARAM_IS_VALID.answer,
            });
          }
          callback(null, null);
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
          callback(null, null);
        }
      },
      callback => {
        try {
          let a = JSON.stringify(usersDemo);
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
            obj.createat = element.createat;
            arr.push(obj);
            // if(element.public==='active') arr.push(obj);
          });
          if (legit.userid) arr = arr.filter(element => element.user_id !== legit.userid);
          result = arr;
          callback(null, null);
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
  let care = false;
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
          /*
            return res.send({
            status: 'error',
            message: 'Sai ma token',
          });
          */
          callback(null, null);
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
          let acc = usersDemo.find(ele => ele.user_id.toString() === userid.toString());
          if (acc) {
            result = acc;
            callback(null, null);
          } else {
            return res.json({
              status: 'error',
              message: 'Không tìm thấy tài khoản này',
            });
          }
        } catch (error) {
          console.log(error);
          res.send({ status: 'error' });
        }
      },
      callback => {
        try {
          let profile = profileDemo.filter(ele => ele.user_id.toString() === userid.toString());
          if (profile) {
            let arr = [];
            profile.forEach(element => {
              let a = JSON.stringify(element);
              let obj = JSON.parse(a);

              arr.push(obj);
            });
            question = arr;
          } else {
            message = 'Chưa trả lời câu hỏi';
          }
          callback(null, null);
        } catch (error) {
          callback(error, null);
        }
      },
      callback => {
        if (legit.userid) {
          try {
            let profile = profileDemo.filter(
              ele => ele.user_id.toString() === legit.userid.toString()
            );
            if (profile) {
              let arr = [];
              profile.forEach(element => {
                let a = JSON.stringify(element);
                let obj = JSON.parse(a);

                arr.push(obj);
              });
              yourQuestion = arr;
            } else {
              message = 'Chưa trả lời câu hỏi';
            }
            callback(null, null);
          } catch (error) {
            callback(error, null);
          }
        } else {
          callback(null, null);
        }
      },
      callback => {
        try {
          let arr = [];
          questionDemo.forEach(element => {
            arr.push(element);
          });
          title = arr;
          callback(null, null);
        } catch (error) {
          callback(error);
        }
      },
      callback => {
        try {
          let arr = [];
          groupDemo.forEach(element => {
            arr.push(element);
          });
          group = arr;
          callback(null, null);
        } catch (error) {
          callback(error);
        }
      },
      callback => {
        try {
          if (legit.userid) {
            let careInfo = userCareDemo.find(
              ele =>
                ele.user_id1.toString() === legit.userid.toString() &&
                ele.user_id2.toString() === userid.toString()
            );
            if (careInfo) {
              care = true;
            }
          } else care = undefined;
          callback(null, null);
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
          yourQuestion,
          timeline: new Date().getTime(),
          care,
        },
      });
    }
  );
}
function updateProfileUser(req, res) {
  /*
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
            user_id: models.uuidFromString(legit.userid),
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
          let userIndex = usersDemo.findIndex(
            ele => ele.user_id.toString() === legit.userid.toString()
          );
          if (userIndex !== -1) {
            usersDemo[userIndex] = object;
          } else {
            return res.json({ status: 'error' });
          }
          callback(null, null);
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
  */
  return res.json({ status: 'ok', timeline: new Date().getTime() });
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
          let userIndex = usersDemo.findIndex(
            ele => ele.user_id.toString() === legit.userid.toString()
          );
          if (userIndex !== -1) {
            usersDemo[userIndex].phone = PARAM_IS_VALID.phone;
          } else {
            return res.json({ status: 'error' });
          }
          callback(null, null);
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
          try {
            let userIndex = usersDemo.findIndex(
              ele => ele.user_id.toString() === legit.userid.toString()
            );
            if (userIndex !== -1) {
              usersDemo[userIndex].email = PARAM_IS_VALID.email;
            } else {
              return res.json({ status: 'error' });
            }
          } catch (error) {
            callback(error, null);
          }
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
          let user = usersDemo.find(ele => ele.user_id.toString() === legit.userid.toString());
          if (user) {
            result = user;
          } else {
            return res.json({
              status: 'error',
              message: 'Không tìm thấy tài khoản này',
            });
          }
          callback(null, null);
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
function changeCare(req, res) {
  let legit = {};
  const token = req.headers['x-access-token'];
  let userid = undefined;
  let params = req.body;
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
      function(callback) {
        try {
          let id = params.userid;
          let uuid = `${id.substring(0, 8)}-${id.substring(8, 12)}-${id.substring(
            12,
            16
          )}-${id.substring(16, 20)}-${id.substring(20, 32)}`;
          userid = models.uuidFromString(uuid);
        } catch (e) {
          console.log(e);
          return res.json({ status: 'error1' });
        }
        callback(null, null);
      },
      callback => {
        try {
          if (params.type === 'user') {
            if (params.care) {
              let object = {
                user_id1: models.uuidFromString(legit.userid),
                user_id2: userid,
                created: new Date().getTime(),
                type: params.type,
              };
              userCareDemo.push(object);
              callback(null, null);
            } else {
              let careIndex = userCareDemo.findIndex(
                ele =>
                  ele.user_id1.toString() === legit.userid.toString() &&
                  ele.user_id2.toString() === userid.toString()
              );
              userCareDemo.splice(1, careIndex);
              callback(null, null);
            }
          } else callback(null, null);
        } catch (error) {
          console.log(error);
          res.send({ status: 'error' });
        }
      },
      callback => {
        try {
          if (params.type === 'user') {
            if (params.care) {
              let object = {
                user_id1: models.uuidFromString(legit.userid),
                user_id2: userid,
                created: new Date().getTime(),
              };
              userWhoCareDemo.push(object);
              callback(null, null);
            } else {
              let query_object = {
                user_id1: models.uuidFromString(legit.userid),
                user_id2: userid,
              };
              let careIndex = userWhoCareDemo.findIndex(
                ele =>
                  ele.user_id1.toString() === legit.userid.toString() &&
                  ele.user_id2.toString() === userid.toString()
              );
              userWhoCareDemo.splice(1, careIndex);
              callback(null, null);
            }
          } else callback(null, null);
        } catch (error) {
          console.log(error);
          res.send({ status: 'error' });
        }
      },
      callback => {
        try {
          if (params.type === 'member') {
            if (params.care) {
              let object = {
                user_id1: models.uuidFromString(legit.userid),
                user_id2: userid,
                created: new Date().getTime(),
                type: params.type,
              };
              userCareDemo.push(object);
              callback(null, null);
            } else {
              let query_object = {
                user_id1: models.uuidFromString(legit.userid),
                user_id2: userid,
              };
              let careIndex = userCareDemo.findIndex(
                ele =>
                  ele.user_id1.toString() === legit.userid.toString() &&
                  ele.user_id2.toString() === userid.toString()
              );
              userCareDemo.splice(1, careIndex);
              callback(null, null);
            }
          } else callback(null, null);
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
      });
    }
  );
}
function getUserCare(req, res) {
  let legit = {};
  let result = [];
  const token = req.headers['x-access-token'];
  let arrUser = [];
  let arrMember = [];
  let arr = [];
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
          let care = userCareDemo.filter(
            ele => ele.user_id1.toString() === legit.userid.toString()
          );
          result = care;
          callback(null, null);
        } catch (e) {
          callback(e, null);
          console.log(e);
        }
      },
      callback => {
        try {
          const user = result.filter(v => v.type === 'user');
          if (user.length > 0) {
            user.forEach((e, i) => {
              let userCare = usersDemo.find(
                ele => ele.user_id.toString() === e.user_id2.toString()
              );
              let obj = {};
              obj.name = userCare.fullname;
              obj.gender = userCare.gender;
              obj.address = userCare.address;
              obj.age = userCare.dob_year;
              obj.user_id = userCare.user_id;
              obj.created = e.created;
              obj.avatar = userCare.avatar;
              obj.type = 'user';
              arrUser.push(obj);
              if (arrUser.length === user.length) {
                callback(null, null);
              }
            });
          } else callback(null, null);
        } catch (e) {
          callback(e, null);
          console.log(e);
        }
      },
      callback => {
        try {
          const member = result.filter(v => v.type === 'member');
          if (member.length > 0) {
            member.forEach((e, i) => {
              let memCare = usersDemo.find(
                ele => ele.membersid.toString() === e.user_id2.toString()
              );
              let obj = {};
              obj.name = memCare.name;
              obj.gender = memCare.gender;
              obj.address = memCare.address;
              obj.location = memCare.location;
              obj.user_id = memCare.membersid;
              obj.age = memCare.year;
              obj.created = e.created;
              obj.avatar = null;
              obj.timeup = memCare.timeup;
              obj.type = 'member';
              arrMember.push(obj);
              if (arrMember.length === member.length) {
                callback(null, null);
              }
            });
          } else callback(null, null);
        } catch (e) {
          callback(e, null);
          console.log(e);
        }
      },
      callback => {
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
  let result = [];
  const token = req.headers['x-access-token'];
  let arr = [];
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
          let whocare = userWhoCareDemo.filter(
            ele => ele.user_id2.toString() === legit.userid.toString()
          );
          result = whocare;
          callback(null, null);
        } catch (e) {
          callback(e, null);
          console.log(e);
        }
      },
      callback => {
        try {
          if (result.length > 0) {
            result.forEach((e, i) => {
              let a = usersDemo.find(ele => ele.user_id.toString() === e.user_id1.toString());
              let obj = {};
              obj.name = a.fullname;
              obj.gender = a.gender;
              obj.address = a.address;
              obj.age = a.dob_year;
              obj.user_id = a.user_id;
              obj.created = e.created;
              obj.avatar = a.avatar;
              arr.push(obj);
              if (arr.length === result.length) {
                callback(null, null);
              }
            });
          } else callback(null, null);
        } catch (e) {
          callback(e, null);
          console.log(e);
        }
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
export default {
  'POST /api/authentication/register': register,
  'POST /api/authentication/login': login,
  'GET /api/authentication/checkuser/:phone': checkUser,
  'GET /api/authentication/question': question,
  'POST /api/authentication/sendanswer': sendAnswer,
  'GET /api/authentication/getuser': getUser,
  'GET /api/authentication/getonlyuser': getOnlyUser,
  'POST /api/authentication/updateprofilequestion': updateProfileQuestion,
  'GET /api/authentication/getallusers': getAllUsers,
  'GET /api/authentication/getuserbyid/:id': getUserById,
  'POST /api/authentication/updateprofileuser': updateProfileUser,
  'POST /api/authentication/changepass': changePass,
  'POST /api/authentication/updatephone': updatePhone,
  'POST /api/authentication/updateemail': updateEmail,
  'POST /api/authentication/changecare': changeCare,
  'GET /api/authentication/getusercare': getUserCare,
  'GET /api/authentication/getuserwhocare': getUserWhoCare,
};
