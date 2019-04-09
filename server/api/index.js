const express = require('express'); // eslint-disable-line

const router = express.Router();

router.use('/user', require('./user'));
router.use('/authentication', require('./authentication'));
router.use('/profile', require('./profile'));
router.use('/upload', require('./upload'));
router.use('/fake_list', require('./fake_list'));
router.use('/tracklist', require('./track'));
router.use('/members', require('./members'));
router.use('/menu', require('./menu'));

module.exports = router;
