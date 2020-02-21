exports.formdata = async (req) => {
    let {
        keyId,
        teamId,
        deviceToken,
        alertMessage,
        alertPayload,
        alertTopic,
        isProduction
    } = req.body;
    let certificate = req.file.path != undefined ? req.file.path : "";
    let data = { keyId, teamId, deviceToken, alertMessage, alertPayload, alertTopic, isProduction,certificate };
    return data;
}