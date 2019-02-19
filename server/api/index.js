const express = require('express'); // eslint-disable-line

const router = express.Router();

router.use('/user', require('./user'));
router.use('/authentication', require('./authentication'));
router.use('/profile', require('./profile'));
router.use('/fake_list', require('./fake_list'));

module.exports = router;
