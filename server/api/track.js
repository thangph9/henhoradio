/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
const async = require('async');
const { getAudioDurationInSeconds } = require('get-audio-duration');
const models = require('../settings');
const express = require('express'); // eslint-disable-line
const router = express.Router();

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
            getAudioDurationInSeconds(`.././cdn/static/data/audio/${element.audio}.MP3`).then(
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
router.get('/', getTrackList);
module.exports = router;
