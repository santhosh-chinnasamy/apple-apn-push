var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');

const push = require('../controller/pushform');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/apn', push.upload.single('certificate'), push.pushmessage);
module.exports = router;
