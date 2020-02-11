const apn = require('apn');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    // filetype: 
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
})
const upload = multer({ storage: storage });

exports.upload = upload;

const formdata = async (input) => {

    let {
        keyId,
        teamId,
        deviceToken,
        alertMessage,
        alertPayload,
        alertTopic,
    } = input.body;

    let certificate = input.file.path;
    let data = { keyId, teamId, deviceToken, alertMessage, alertPayload, alertTopic, certificate };
    return data;
}

// Apple APN code
exports.pushmessage = async (req, res) => {

    let data = await formdata(req);
    let options = {};
    options.token = {
        key: data.certificate,
        keyId: data.keyId,
        teamId: data.keyId,
    };
    options.production = false

    let apnProvider = new apn.Provider(options);
    let deviceToken = data.deviceToken;

    // Prepare Notification
    let notification = new apn.notification();
    notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600;
    notification.badge = 2;
    notification.sound = 'ping.aiff';
    notification.alert = data.alertMessage;
    notification.payload = { "messageFrom": data.alertPayload };
    notification.topic = data.alertTopic;

    console.log(notification);
    
    // Send Notification
    apnProvider.send(notification, deviceToken)
        .then(result => {
            res.send(result);
        });

    // Close apn service
    apnProvider.shutdown();
}