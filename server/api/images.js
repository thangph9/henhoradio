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
const router = express.Router();
router.get('/images/ft/:imageid', uploadFileAvatar);
module.exports = router;
