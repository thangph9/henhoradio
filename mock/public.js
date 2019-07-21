const async = require('async');
// const fs = require('fs');
// const driver = require('cassandra-driver');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const moment = require('moment');
const request = require('request'); // eslint-disable-line
// const models = require('../settings');
/* eslint-disable prefer-destructuring */
// const Uuid = models.datatypes.Uuid;

// const jwtpublic = fs.readFileSync('./ssl/jwtpublic.pem', 'utf8');
// const jwtprivate = fs.readFileSync('./ssl/jwtprivate.pem', 'utf8');
/*
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
*/
const usersDemo = [];
const memberDemo = [];
const care1 = [];
const care2 = [];

for (let i = 0; i < 10000; i += 1) {
  memberDemo.push({
    membersid: 'b2845602e968'.concat(i),
    address: 'Đông Anh - Hà Nội',
    avatar: 'cc81efc3-9957-4c15-abc5-b2845602e968',
    description: null,
    dob_day: 27,
    dob_month: 6,
    dob_year: 1997,
    email: 'trjvjp97@gmail.com',
    gender: i % 2 === 0 ? 'MALE' : 'FEMALE',
    name: 'Tri '.concat(i),
    hhr_goal: null,
    phone: '0373962095',
    jobs: { jobs1: 'Ở nhà', jobs2: '20000000' },
    relationship: 'Độc thân',
    ucode: i + 1,
    gcode: i + 2,
    location: i % 2 === 0 ? 'HN' : 'HCM',
    audio: null,
    createat: '2019-03-14T14:59:27.728Z',
  });
}
for (let i = 0; i < 30000; i += 1) {
  usersDemo.push({
    id: 'a0a8c0d5-88b7-4d2a-8015-51952e6748e2',
    membersid: '51952e6748e2'.concat(i),
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
    gender: i % 2 === 0 ? 'male' : 'female',
    name: 'Thang '.concat(i),
    height: '177',
    weight: '72',
    hhr_goal: null,
    phone: '0373962095',
    uniqueid: null,
    video: null,
    living: 'Hà Nội',
    active_friend: false,
    jobs: { jobs1: 'Ở nhà', jobs2: '20000000' },
    hobbys: { hobby1: 'Đá bóng', hobby2: 'Nghe nhạc' },
    assets: { asset1: 'Nhà 3 tầng', asset2: 'BMW' },
    marriage: 'Độc thân',
    vov: true,
    location: null,
    education: { education: 'Đại học' },
    audio: null,
    phones: { '1': '0373962095' },
    createat: '2019-03-14T14:59:27.728Z',
  });
}
for (let i = 0; i < 5000; i += 1) {
  care1.push({
    user_id1: 'abc52e6748ee'.concat(i),
    user_id2: 'b2845602e968'.concat(i),
    type: 'member',
  });
}
for (let i = 0; i < 20; i += 1) {
  care2.push({
    user_id1: 'abc52e6748ee'.concat(i),
    user_id2: '51952e6748e2'.concat(i),
    type: 'user',
  });
}
const newList = usersDemo.concat(memberDemo);
const jsonUserCare = care1.concat(care2);
/*
let loginDemo = [
  {
    phone: '0373962095',
    user_id: 'abc52e6748ee',
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
*/
/* ------------------------------------------------------------------------------------------------------------------------------------------------ */
function getData(req, res) {
  const { query } = req;
  const { radio, gender, sort, date, page } = query;
  let listMember = [];

  async.series(
    [
      function filterRadio(callback) {
        listMember = newList.filter(e => {
          if (radio === 'ALL') return e;
          if (radio === 'VALID') return e.id !== undefined;
          return e.location === radio;
        });
        callback(null, null);
      },
      function filterGender(callback) {
        listMember = listMember.filter(e => {
          if (gender === 'ALL') return e;
          return e.gender.toUpperCase() === gender.toUpperCase();
        });
        callback(null, null);
      },
      function filterDate(callback) {
        if (date) {
          listMember = listMember.filter(e => {
            const eDate = moment(e.timeup).format('DD_MM_YYYY');
            return eDate === date;
          });
        }
        callback(null, null);
      },
      function sortByNew(callback) {
        if (sort === 'newest') {
          listMember.sort((e, f) => {
            const eTime = new Date(e.timeup).getTime();
            const jTime = new Date(f.timeup).getTime();
            return jTime - eTime;
          });
        }
        callback(null, null);
      },
      function sortBySpecial(callback) {
        if (sort === 'special') {
          listMember = listMember.filter(e => e.species && e.species === 1);
        }
        callback(null, null);
      },
      function sortByDefault(callback) {
        if (sort === 'default') {
          listMember.sort((e, f) => {
            const eTime = new Date(e.timeup).getTime();
            const jTime = new Date(f.timeup).getTime();
            return jTime - eTime;
          });
        }
        callback(null, null);
      },
      function checkusercare(callback) {
        if (jsonUserCare.length > 0) {
          listMember.forEach(e => {
            const userCareFound = jsonUserCare.find(k => e.membersid === k.user_id2);
            if (userCareFound) {
              e.isCare = userCareFound.user_id1;
              e.type = userCareFound.type ? userCareFound.type : null;
            }
          });
        }
        callback(null, null);
      },
    ],
    err => {
      if (err) return res.send({ status: 'error' });

      const currentPage = page;
      const beginPage = (currentPage - 1) * 32;
      const endPage = beginPage + 32;
      const result = listMember.slice(beginPage, endPage);
      const pagination = {
        current: currentPage,
        page: 32,
        total: listMember.length,
        begin: beginPage + 1,
        end: endPage > listMember.length ? listMember.length : endPage,
      };
      return res.send({ status: 'ok', data: { list: result, pagination } });
    }
  );

  // const defaultSort=listMember;

  // check user care
}

export default {
  'GET /api/DATA/DT': getData,
};
