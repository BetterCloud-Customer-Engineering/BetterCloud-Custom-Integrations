const axios = require('axios');
let secrets;
let encodedAuthKey;
let errorCallback;

const getApplicationId = async (applicationName) => {
    try {
        const getApplicationsRequest = {
            method: 'GET',
            url: `https://${secrets.domain}/crowd/rest/admin/1.0/application?limit=1000`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${encodedAuthKey}`
            }
        };
        const response = await axios(getApplicationsRequest);
        const applications = response.data.values.filter(application => application.name.toLowerCase().trim() === applicationName.toLowerCase().trim());

        if (applications.length > 1) {
            errorCallback(`Error getting Application ID. There are multiple applications with name "${applicationName}."`);
        } else if (applications.length === 0) {
            errorCallback(`Error getting Application ID. There are no applications with name "${applicationName}."`);
        } else {
            return applications[0].id;
        }
    } catch (err) {
        errorCallback(`Error getting Application ID for application with name "${applicationName}: ${err}"`);
    }
};

module.exports = async (input, callback, error) => {
    try {
        let request = input.request;
        secrets = input.secrets;
        errorCallback = error;
        encodedAuthKey = new Buffer.from(`${secrets.adminUserName}:${secrets.adminPassword}`).toString('base64');
        const applicationId = await getApplicationId(request.body.applicationName, encodedAuthKey);
        request.url = request.url.replace('{applicationId}', applicationId);
        callback(request);
    } catch (err) {
        error(`getApplicationId Pre Request Script failed: ${err}`);
    }
};
