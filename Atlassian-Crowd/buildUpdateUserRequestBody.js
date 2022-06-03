const axios = require('axios');
let secrets;
let encodedAuthKey;
let errorCallback;

const getUser = async (username) => {
    try {
        const getUserRequest = {
            method: 'GET',
            url: `https://${secrets.domain}/crowd/rest/usermanagement/1/user?username=${username}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${encodedAuthKey}`
            }
        };
        const response = await axios(getUserRequest);
        return response.data;
    } catch (err) {
        errorCallback(`Error getting User with username "${username}": ${err}`);
    }
};

const buildRequestBody = (userData, inputBody) => {
    let newBody = {};
    for (let property in inputBody) {
        if (userData[property]) {
            inputBody[property] === null ? newBody[property] = userData[property] : newBody[property] = inputBody[property];
        }
    }
    return newBody;
};

module.exports = async (input, callback, error) => {
    try {
        let request = input.request;
        secrets = input.secrets;
        errorCallback = error;
        encodedAuthKey = new Buffer.from(`${secrets.auth_username}:${secrets.auth_password}`).toString('base64');
        const userData = await getUser(request.body.name, encodedAuthKey);
        const newBody = buildRequestBody(userData, request.body);
        request.body = newBody;
        callback(request);
    } catch (err) {
        error(`buildUpdateUserRequestBody Pre Request Script failed: ${err}`);
    }
};
