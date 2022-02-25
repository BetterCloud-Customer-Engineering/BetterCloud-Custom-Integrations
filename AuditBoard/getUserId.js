const axios = require('axios');
let errorCallback;

const getAuditBoardUserId = async (baseUrl, apiKey, email) => {

    let getUserUrl = `${baseUrl}/Users?filter=email eq "${email}"`

    const getUserRequest = {
        method: 'GET',
        url: getUserUrl,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Authorization":apiKey
        }
    };
    try {
        const response = await axios(getUserRequest);
        const users = response.data.Resources,
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
    let secrets = input.secrets;
    let request = input.request,
        requestBody = request.body,
        email = requestBody.email.toLowerCase().trim();

    let apiKey = secrets["auth_Authorization"],
        baseUrl = secrets["baseUrl"];

    errorCallback = error;

    try {
        const userId = await getAuditBoardUserId(baseUrl, apiKey, email);
        request.url = request.url.replace('{userId}', userId);

        callback(request);
    } catch (err) {
        error(err);
    }
};

