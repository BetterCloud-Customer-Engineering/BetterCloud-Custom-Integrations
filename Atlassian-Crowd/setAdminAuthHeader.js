module.exports = async (input, callback, error) => {
    try {
        let request = input.request;
        let secrets = input.secrets;
        let encodedAuthKey = new Buffer.from(`${secrets.adminUserName}:${secrets.adminPassword}`).toString('base64');
        request.headers.Authorization = `Basic ${encodedAuthKey}`;
        callback(request);
    } catch (err) {
        error(`addDirectoryIdToURL Pre Request Script failed: ${err}`);
    }
};