/* eslint-disable import/newline-after-import */
/* eslint-disable import/order */

const async = require('async'); // eslint-disable-line
const express = require('express'); // eslint-disable-line
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const multer = require('multer'); // eslint-disable-line

const models = require('../settings');

// const jwtprivate = fs.readFileSync('./ssl/jwtprivate.pem', 'utf8');
const upload = multer();

const Uuid = models.datatypes.Uuid; // eslint-disable-line

function audioUpload(req, res) {
  upload.single('logo')(req, res, err => {
    if (err) return res.send({ status: 'error' });
    const audioid = Uuid.random();
    try {
      const file = req.file; // eslint-disable-line
      const audio = file.buffer; // eslint-disable-line
      const description = {
        filename: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
      };
      const audioObject = {
        audioid,
        audio,
        description,
        createat: new Date(),
      };

      const instance = new models.instance.audio(audioObject); // eslint-disable-line
      // eslint-disable-next-line
      instance.save(err => {
        if (err) return res.send({ status: 'error' });
      });
    } catch (e) {
      console.log(e);
      return res.send({ status: 'error' });
    }
    return res.send({ status: 'ok', file: { audioid } });
  });
}
function loadAudio(req, res) {
  const params = req.params; // eslint-disable-line
  const PARAM_IS_VALID = {};
  const data = {};
  async.series(
    [
      function initParams(callback) {
        try {
          PARAM_IS_VALID.audioid = models.uuidFromString(params.audioid);
        } catch (e) {
          res.send({ status: 'error' });
        }
        callback(null, null);
      },
      function fetchAudio(callback) {
        models.instance.audio.find({ audioid: PARAM_IS_VALID.audioid }, (err, track) => {
          if (track && track.length > 0) {
            data.audio = track[0].audio;
          }
          callback(err, null);
        });
      },
    ],
    err => {
      if (err) return res.send({ status: 'error' });
      const stat = data.audio;
      res.header({
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size,
      });
      return res.end(stat);
    }
  );
}

const track = [
  {
    track_id: 'b1582d57-9dfa-4e1d-92e5-4c7263e5a08e',
    audio: 'b556c126-10fd-4a8c-b323-674816fde160',
    description: 'no nnem',
    icon: null,
    mc: 'Trí',
    youtube: null,
    status: '1',
    title: 'Tình yêu hoa gió',
    local: 'HN',
    date: '2019-04-18T03:26:44.488Z',
    createat: '2019-04-16T03:28:45.275Z',
  },
  {
    track_id: '01c11ac0-3e44-4a00-8e81-6c2cb106b317',
    audio: '6dffe006-837a-44bd-84fd-3a906ff5f234',
    description: 'no name',
    icon: null,
    mc: 'Trí',
    youtube: null,
    status: '1',
    title: 'Đập vỡ cây đàn',
    local: 'HN',
    date: '2019-04-10T01:39:59.293Z',
    createat: '2019-04-13T01:51:12.062Z',
  },
  {
    track_id: '346114e7-ccc0-4245-a7dc-287fed075f54',
    audio: 'fa378571-9a91-4293-9995-0bb338999558',
    description: 'no nnem',
    icon: null,
    mc: 'Trí',
    youtube: null,
    status: '1',
    title: 'Đợi chờ là hạnh phúc',
    local: 'HN',
    date: '2019-04-16T03:26:44.488Z',
    createat: '2019-04-16T03:26:58.294Z',
  },
  {
    track_id: 'ffc14947-f841-496c-a2d7-518ddcea0112',
    audio: '5a8b7241-b5fd-4f34-b75a-62656fff2409',
    description: 'no nnem',
    icon: null,
    mc: 'Trí',
    youtube: null,
    status: '1',
    title: 'Hoa bằng lăng',
    local: 'HCM',
    date: '2019-04-14T03:26:44.488Z',
    createat: '2019-04-16T03:28:02.229Z',
  },
  {
    track_id: 'e23bd038-c18f-4561-bcd1-e881cbb72a51',
    audio: '1b8b399b-704f-4131-bc97-046766574ddf',
    description: 'no nnem',
    icon: null,
    mc: 'Trí',
    youtube: null,
    status: '1',
    title: 'Dấu chân kỷ niệm',
    local: 'HN',
    date: '2019-04-18T03:26:44.488Z',
    createat: '2019-04-16T03:28:26.726Z',
  },
  {
    track_id: 'af5fb70e-f373-4142-b8ee-068bd24bbf26',
    audio: '2430d0d1-12d1-4879-ae47-31d223e2392e',
    description: 'no nnem',
    icon: null,
    mc: 'Trí',
    youtube: null,
    status: '1',
    title: 'Đường tình đôi ngả',
    local: 'HCM',
    date: '2019-04-15T03:26:44.488Z',
    createat: '2019-04-16T03:27:41.733Z',
  },
];

function getTrackList(req, res) {
  let result = [];
  async.series(
    [
      function(callback) {
        result = track;
        callback(null, null);
      },
    ],
    err => {
      if (err) return res.json({ status: 'error' });
      return res.json({ status: 'ok', data: result });
    }
  );
}
const dataDetail = [
  {
    member_id: 1,
    address: 'Hà Nội',
    name: 'Nguyễn Hoàng Z',
    day: 12,
    month: 2,
    year: 1997,
    gender: 'male',
    timeup: '25/3/2019',
    job: 'Bác sĩ',
    audio:
      'https://vnno-zn-5-tf-mp3-s1-zmp3.zadn.vn/b9aa20ec13abfaf5a3ba/1502019886813006440?authen=exp=1553534527~acl=/b9aa20ec13abfaf5a3ba/*~hmac=ad06a1317a812e3daccae0676a42de9c',
    duration: 298,
  },
  {
    member_id: 1,
    address: 'Hà Nội',
    day: 12,
    name: 'Nguyễn Văn F',
    month: 2,
    year: 1997,
    gender: 'male',
    timeup: '25/3/2019',
    job: 'Bác sĩ',
    audio:
      'https://vnno-vn-6-tf-mp3-s1-zmp3.zadn.vn/0287cab2fef517ab4ee4/4725938721176572736?authen=exp=1553534564~acl=/0287cab2fef517ab4ee4/*~hmac=45098c77c7f1d862d340a29217b04205',
    duration: 192,
  },
  {
    member_id: 2,
    address: 'Thái Bình',
    name: 'Nguyễn Thị A',
    day: 4,
    month: 1,
    year: 1984,
    gender: 'female',
    timeup: '24/3/2019',
    job: 'Giáo sư',
    audio:
      'https://vnno-zn-5-tf-mp3-s1-zmp3.zadn.vn/01265cb096f47faa26e5/6908679624977146479?authen=exp=1553534573~acl=/01265cb096f47faa26e5/*~hmac=c5f477e19e4c290852caf9d1e9d1d85a',
    duration: 306,
  },
  {
    member_id: 3,
    address: 'Hà Nội',
    name: 'Nguyễn Thị B',
    day: 10,
    month: 7,
    year: 1992,
    gender: 'female',
    timeup: '25/3/2019',
    job: 'Giáo viên',
    audio:
      'https://vnno-zn-5-tf-mp3-s1-zmp3.zadn.vn/500d4c758e31676f3e20/5421244242980541085?authen=exp=1553532314~acl=/500d4c758e31676f3e20/*~hmac=e1110b52b3257093a1177a0b138084d0',
    duration: 217,
  },
  {
    member_id: 4,
    address: 'Hà Nam',
    name: 'Nguyễn Văm D',
    day: 12,
    month: 5,
    year: 1985,
    gender: 'male',
    timeup: '23/3/2019',
    job: 'Kỹ sư',
    audio:
      'https://vnno-vn-6-tf-mp3-s1-zmp3.zadn.vn/a3a723e410a3f9fda0b2/4959260805179337474?authen=exp=1553532257~acl=/a3a723e410a3f9fda0b2/*~hmac=2fddc41d35338e71efe280b818731291',
    duration: 305,
  },
];
function getDetailList(req, res) {
  res.json({ status: 'ok', data: dataDetail });
}
export default {
  'POST /upload/audio': audioUpload,
  'GET /upload/audio/:audioid': loadAudio,
  'GET /api/tracklist': getTrackList,
  'GET /api/detaillist': getDetailList,
};
