/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
const async = require('async');
const models = require('../settings');
const express = require('express'); // eslint-disable-line
const router = express.Router();

function getTrackList(req, res) {
  let result = [];
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
    ],
    err => {
      if (err) return res.json({ status: 'error' });
      return res.json({ status: 'ok', data: result });
    }
  );
}
router.get('/', getTrackList);
module.exports = router;
