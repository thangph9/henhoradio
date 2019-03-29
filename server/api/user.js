const express = require('express'); // eslint-disable-line

const router = express.Router();

router.get('/user', (req, res) => {
  res.send({ status: 'oke' });
});
router.get('/setting', (req, res) => {
  res.send({
    status: 'ok',
    setting: {
      // cdn : '/images/ft/',
      cdn: 'http://cdn.henhoradio.net/images/ft/',
    },
  });
});
module.exports = router;
