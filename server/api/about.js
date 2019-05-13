/* eslint-disable import/order */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */

const about = {
  About: {
    logo: 'https://cdn.okccdn.com/media/img/dtf/logo.png',
    titleImage: 'https://cdn.okccdn.com/media/img/dtf/title.png',
    title: 'Dating Deserves Better',
    introduce:
      'On OkCupid, you’re more than just a photo. You have stories to tell, and passions to share, and things to talk about that are more interesting than the weather. Get noticed for who you are, not what you look like. Because you deserve what dating deserves: better.',
    guide:
      'By clicking Join, you agree to our Terms of Service. Learn about how we process and use your data in our Privacy Policy and how we use cookies and similar technology in our Cookie Policy.',
    androidIcon: 'https://cdn.okccdn.com/media/img/dtf/apps_googleplay2.png',
    appleStoreIcon: 'https://cdn.okccdn.com/media/img/dtf/apps_apple.png',
    iconFooter: [
      {
        type: 'facebook',
        fontSize: '30px',
        color: '#3b5999',
        theme: 'outlined',
      },
      {
        type: 'instagram',
        fontSize: '30px',
        theme: 'outlined',
        color: '#e4405f',
      },
    ],
    titleMobile: "You're about to go on better dates",
    introduceMobile: "We go beneath the suface to show off the real you. How's that for a change?",
    guideMobile:
      'By tapping Join, you agree to our Terms of Service. Learn about how we process and use your data in our Privacy Policy and how we use cookies and similar technology in our Cookie Policy',
    backgroundColor: ['#f0a1c1', '#21c3fd', '#FFC5E3', '#24D8F3', '#20BD66'],
    // index của màu nền tương ứng với index của ảnh
    backgroundImage: [
      {
        image: 'https://cdn.okccdn.com/media/img/dtf/photos/hands.jpg',
        position: 'calc(50% + 375px) calc(100% + 10px)',
        size: '825px auto',
      },
      {
        image: 'https://cdn.okccdn.com/media/img/dtf/photos/facepaint.jpg',
        position: 'calc(50% + 300px) calc(100% + 10px)',
        size: '650px auto',
      },
      {
        image: 'https://cdn.okccdn.com/media/img/dtf/photos/rose.jpg',
        position: 'calc(50% + 455px) calc(100% + 10px)',
        size: '975px auto',
      },
      {
        image: 'https://cdn.okccdn.com/media/img/dtf/photos/couch.jpg',
        position: 'calc(50% + 285px) calc(100% + 10px)',
        size: '551px auto',
      },
      {
        image: 'https://cdn.okccdn.com/media/img/dtf/photos/eyemasks.jpg',
        position: 'calc(50% + 300px) calc(100% + 10px)',
        size: '694px auto',
      },
    ],
    menuId: '775f5da7-cff2-4336-8221-71455ac6c9a7',
  },
  LoginPage: {
    useCaptcha: false,
    iconHeader: [
      {
        type: 'facebook',
        fontSize: '30px',
        color: '#3b5999',
        theme: 'filled',
      },
      {
        type: 'instagram',
        fontSize: '30px',
        theme: 'filled',
        color: '#e4405f',
      },
    ],
    logo:
      'https://twoo-a.akamaihd.net/static/682503600911326952191/images/logos/logo-twoo-flat-white@2x.png',
    title: 'Chat với bạn mới khắp thế giới.',
    introduce:
      'Gặp hàng triệu người từ khắp nơi bất kể bạn ở đâu. Chat vui vẻ, kết bạn và tìm một nửa của mình. Bởi vì cuộc đời chính là những người bạn gặp gỡ.',
  },
};
const express = require('express');

function getabout(req, res) {
  return res.json({ status: 'ok', data: about.About });
}
function getlogin(req, res) {
  return res.json({ status: 'ok', data: about.LoginPage });
}

const router = express.Router();
router.get('/getabout', getabout);
router.get('/getlogin', getlogin);
module.exports = router;
