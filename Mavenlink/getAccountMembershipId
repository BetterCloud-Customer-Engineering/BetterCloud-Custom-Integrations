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

const getAccountMembershipId = async (userId) => {
    const request = {
        method: "GET",
        url: `https://api.mavenlink.com/api/v1/account_memberships?by_user_id=${userId}`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `${apiToken}`
        }
    }

    try {
        const response = await axios(request);
        const memberships = response.data.results
        if (memberships.length > 1) {
            errorCallback(`Multiple memberships exist for that user: ${userId}`)
        }
        else if (memberships.length === 1) {
            let matchingMembershipId = memberships[0].id;
            let membership = response.data.account_memberships[matchingMembershipId];
            if (membership && membership.user_id === userId) {
                return matchingMembershipId;
            }
            else {
                errorCallback(`Membership found but does not match input userId: ${userId}`);
            }
        }
        else {
            errorCallback(`No membershipId returned for that user's Id: ${userId}`);
        }
    } catch (err) {
        errorCallback(`Error finding membership. Error: ${err}`);
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
        const accountMembershipId = await getAccountMembershipId(userId);
        const updatedUrl = url.replace('{accountMembershipId}', accountMembershipId);
        request.url = updatedUrl;
        callback(request);
    } catch (err) {
        errorCallback(err);
    }
};