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
export default {
  'POST /upload/audio': audioUpload,
  'GET /upload/audio/:audioid': loadAudio,
  'GET /api/tracklist': getTrackList,
};
