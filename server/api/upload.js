/* eslint-disable import/order */
/* eslint-disable new-cap */
/* eslint-disable prefer-destructuring */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef-init */
/* eslint-disable no-shadow */
/* eslint-disable prefer-const */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
const async = require('async'); // eslint-disable-line
const express = require('express'); // eslint-disable-line
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const multer = require('multer'); // eslint-disable-line

const models = require('../settings');

const router = express.Router();
// const jwtprivate = fs.readFileSync('./ssl/jwtprivate.pem', 'utf8');

const Uuid = models.datatypes.Uuid; // eslint-disable-line
const upload = multer();
const sizeOf = require('image-size');

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
function uploadFileAvatar(req, res) {
  let dimensions = '';
  const isValid = true;
  upload.single('file')(req, res, function(err) {
    if (err) {
      console.log(err);
      return res.send({ status: 'error' });
    }
    let imageid = Uuid.random();
    try {
      let file = req.files[0];
      let image = file.buffer;
      let options = {
        filename: file.originalname,
        size: `${file.size}`,
        encoding: file.encoding,
        mimetype: file.mimetype,
      };
      let image_object = {
        image_id: imageid,
        image,
        options,
        createat: new Date(),
        face_active: false,
      };
      dimensions = sizeOf(image);
      let object = image_object;
      let instance = new models.instance.images(object);
      let save = instance.save(function(err) {});
    } catch (e) {
      console.log(e);
      return res.send({ status: 'error' });
    }
    res.send({ status: 'ok', file: { imageid, isValid } });
  });
}
router.get('/upload/audio/:audioid', loadAudio);
router.post('/api/upload/avatar', uploadFileAvatar);
module.exports = router;
