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
const { getAudioDurationInSeconds } = require('get-audio-duration');
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
function getTrackList(req, res) {
  let result = [];
  const obj = {};
  async.series(
    [
      function(callback) {
        try {
          models.instance.track.find({}, (err, trackData) => {
            result = trackData;
            callback(err, null);
          });
        } catch (error) {
          callback(error, null);
        }
      },
      function(callback) {
        try {
          result.forEach(element => {
            getAudioDurationInSeconds(`.././cms_hhr/public/files/${element.audio}.MP3`).then(
              duration => {
                obj[`${element.audio}`] = duration;
                if (Object.keys(obj).length === result.length) {
                  callback(null, obj);
                }
              }
            );
          });
        } catch (error) {
          callback(error, null);
        }
      },
    ],
    (err, kq) => {
      if (err) return res.json({ status: 'error' });
      return res.json({ status: 'ok', data: result, duration: kq[1] });
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
