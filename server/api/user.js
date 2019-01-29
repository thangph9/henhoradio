const express = require('express'); // eslint-disable-line

const router = express.Router();

router.get('/user', (req, res) => {
  res.send({ status: 'oke' });
});
module.exports = router;
