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

const upload = multer();
const sizeOf = require('image-size');
const models = require('../settings');

const Uuid = models.datatypes.Uuid;

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

export default {
  'POST /api/upload/avatar': uploadFileAvatar,
  'GET /images/ft/:imageid': imageByTri,
};
