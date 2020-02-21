const apn = require('apn');
const multer = require('multer');
const path = require('path');
const util = require('../util/util');

const storage = multer.diskStorage({
    // filetype: 
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: function (req, file, cb) {
        cb(null, "cert" + '-' + Date.now() + path.extname(file.originalname));
    },
})
const upload = multer({ storage: storage });

exports.upload = upload;

// Apple APN code
exports.pushmessage = async (req, res) => {

    let data = await util.formdata(req);
    let isproduction = data.isproduction ? data.isproduction : false;
    let options = {
        token: {
            key: data.certificate,
            keyId: data.keyId,
            teamId: data.keyId,
        },
        production: isproduction
    };
    let apnProvider = new apn.Provider(options);
    let deviceToken = data.deviceToken;

    // Prepare Notification
    let notification = new apn.Notification();
    notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600;
    notification.badge = 2;
    notification.sound = 'ping.aiff';
    notification.alert = data.alertMessage;
    notification.payload = { 'messageFrom': data.alertPayload };
    notification.topic = "" + data.alertTopic;

    // Send Notification
    apnProvider.send(notification, deviceToken)
        .then(result => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });

    // Close notification service
    apnProvider.shutdown();
}