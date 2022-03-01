const axios = require('axios');
let secrets;
let errorCallback;
let apiToken;

const getUserId = async (email) => {
    const request = {
        method: "GET",
        url: `https://api.mavenlink.com/api/v1/users?on_my_account=true&by_email_address=${email}`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `${apiToken}`
        }
    }

    try {
        const response = await axios(request);
        const matchingUsers = response.data.results;
        if (matchingUsers.length > 1) {
            errorCallback(`Multiple users exist for that email: ${email}`);
        }
        else if (matchingUsers.length === 1) {
            let matchingUserId = matchingUsers[0].id;
            let user = response.data.users[matchingUserId];
            if (user && user.email_address.toLowerCase() === email.toLowerCase()) {
                    return matchingUserId;
            }
            else {
                errorCallback(`UserId found but does not match input email: ${email}`);
            }
        }
        else {
            errorCallback(`No userId returned for that user's email: ${email}`);
        }
    } catch (err) {
        errorCallback(`Error finding user in that organization. Error: ${err}`);
    }
}

module.exports = async (input, callback, error) => {
    secrets = input.secrets;
    let request = input.request;
    let email = request.body.email;
    let url = request.url
    apiToken = secrets.auth_Authorization;
    errorCallback = error;
    try {
        const userId = await getUserId(email);
        const updatedAccountMembershipUrl = url.replace('{userId}', userId);
        request.url = updatedAccountMembershipUrl;
        callback(request);
    } catch (err) {
        errorCallback(err);
    }
};