/* eslint-disable no-use-before-define */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
const async = require('async');
const express = require('express'); // eslint-disable-line
const router = express.Router();
const mp3Duration = require('mp3-duration');
const models = require('../settings');

function getTrackList(req, res) {
  let result = [];
  // eslint-disable-next-line prefer-const
  let dataTemp = [];
  async.series(
    [
      function(callback) {
        try {
          models.instance.track.find({}, function(err, trackData) {
            const a = JSON.stringify(trackData);
            result = JSON.parse(a);
            callback(err, null);
          });
        } catch (error) {
          callback(error, null);
        }
      },
      function(callback) {
        try {
          result.forEach(element => {
            let obj = element;
            getDuration(`../cms_hhr/public/files/${element.audio}.MP3`, function(duration) {
              obj.duration = duration;
              dataTemp.push(obj);
            });
          });

          callback(null, null);
        } catch (error) {
          callback(error, null);
        }
      },
    ],
    err => {
      setTimeout(() => {
        console.log(dataTemp);
        if (err) return res.json({ status: 'error' });
        return res.json({ status: 'ok', data: dataTemp });
      }, 5000);
    }
  );
}
function getDuration(src, cb) {
  mp3Duration(src, function(err, duration) {
    if (err) return console.log(err);
    cb(duration);
  });
}
router.post('/', getTrackList);
module.exports = router;
