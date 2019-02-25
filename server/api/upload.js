const async = require('async'); // eslint-disable-line
const express = require('express'); // eslint-disable-line
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const multer = require('multer'); // eslint-disable-line

const models = require('../settings');

const router = express.Router();
// const jwtprivate = fs.readFileSync('./ssl/jwtprivate.pem', 'utf8');

const Uuid = models.datatypes.Uuid; // eslint-disable-line

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
router.get('/upload/audio/:audioid', loadAudio);
module.exports = router;
