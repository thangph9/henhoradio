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

const multer = require('multer');
const async = require('async');
const express = require('express'); // eslint-disable-line
const upload = multer();
const sizeOf = require('image-size');
const models = require('../settings');

const Uuid = models.datatypes.Uuid;
function imageByTri(req, res) {
  let image = null;
  let imageid = '';
  async.series(
    [
      function(callback) {
        try {
          let rawImage = req.params.imageid;
          imageid = models.uuidFromString(rawImage);
        } catch (e) {
          res.contentType('image/jpeg');
          return res.end('', 'binary');
        }
        callback(null, null);
      },
      function(callback) {
        try {
          models.instance.images.find({ image_id: imageid }, function(err, img) {
            if (img && img.length > 0) {
              image = img[0].image;
            }
            callback(err, null);
          });
        } catch (error) {
          console.log(error);
          callback(error, null);
        }
      },
    ],
    function(err, result) {
      try {
        if (err) {
          res.contentType('image/jpeg');
          res.end('', 'binary');
        } else if (image != null) {
          res.writeHead(200, { 'Content-Type': 'image/jpg' });
          res.end(image, 'binary');
        } else {
          res.contentType('image/jpeg');
          res.end('', 'binary');
        }
      } catch (error) {
        console.log(error);
      }
    }
  );
}

const router = express.Router();
router.get('/images/ft/:imageid', imageByTri);
module.exports = router;
