const axios = require('axios');
let secrets;
let authKey;
let errorCallback;

let baseUrl = "https://uplight.auditboardapp.com/api/v1/scim";

const getUplightUserId = async (email) => {

    let url = baseUrl + '/users?email=${email}'

    const getUserRequest = {
        method: "GET",
        url: url,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-api-key': authKey
        }
    };
    try {
        const response = await axios(getUserRequest);
        const users = response.data,
            matchingUser = users.find(user => user.email.toLowerCase() === email);
        if (matchingUser)
            return matchingUser.id;
        else
            errorCallback(`No user found with email ${email}.`);
    } catch (err) {
        errorCallback(`Error finding Insight users. Error: ${err}`);
    }
};

module.exports = async (input, callback, error) => {
    secrets = input.secrets;
    let request = input.request,
        requestBody = request.body,
        email = requestBody.email.toLowerCase().trim();

    authKey = secrets["auth_x-api-key"];
    errorCallback = error;

    try {
        const userId = await getUplightUserId(email);

        request.url = request.url.replace('{userId}', userId);
        request.url = request.url.replace('{roleId}', roleId);
        request.url = request.url + "/Users/" + userId

        callback(request);
    } catch (err) {
        error(err);
    }
};

