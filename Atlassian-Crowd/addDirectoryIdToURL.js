const axios = require('axios');
let secrets;
let encodedAuthKey;
let errorCallback;

const getDirectoryId = async (directoryName) => {
    try {
        const getDirectoriesRequest = {
            method: 'GET',
            url: `https://${secrets.domain}/crowd/rest/admin/1.0/directory/managed?limit=1000`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${encodedAuthKey}`
            }
        };
        const response = await axios(getDirectoriesRequest);
        const directories = response.data.values.filter(directory => directory.displayName.toLowerCase().trim() === directoryName.toLowerCase().trim());

        if (directories.length > 1) {
            errorCallback(`Error getting Directory ID. There are multiple directories with name "${directoryName}."`);
        } else if (directories.length === 0) {
            errorCallback(`Error getting Directory ID. There are no directories with name "${directoryName}."`);
        } else {
            return directories[0].id;
        }
    } catch (err) {
        errorCallback(`Error getting Directory ID for directory with name "${directoryName}: ${err}"`);
    }
}

module.exports = async (input, callback, error) => {
    try {
        let request = input.request;
        secrets = input.secrets;
        errorCallback = error;
        encodedAuthKey = new Buffer.from(`${secrets.adminUserName}:${secrets.adminPassword}`).toString('base64');
        const directoryId = await getDirectoryId(request.body.directoryName, encodedAuthKey);
        request.url = request.url.replace('{directoryId}', directoryId);
        callback(request);
    } catch (err) {
        error(`addDirectoryIdToURL Pre Request Script failed: ${err}`);
    }
};

