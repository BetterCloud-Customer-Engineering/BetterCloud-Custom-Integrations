const axios = require("axios");
let errorCallback;

const getUserProfileFromId = async (region, headers, userId) => {

    const request_getUsers = {
        method:'GET',
        url:`https://${region}.nice-incontact.com/user-management/v1/users/${userId}`,
        headers:headers
    }

    try{
        const response_getUser = await axios(request_getUsers);
        const user = response_getUser.data.user;

        return(user);
    } catch (err){
        errorCallback(`Error getting profile for user with id: ${userId}. Error:` + err);
    }
}

module.exports = async (input, callback, error) => {
    // Globals
    errorCallback = error;

    // Setup
    let headers = input.request.headers,
        userId = input.request.body.userId,
        region = input.secrets.region;

    // Execution
    try {
        input.request.body.userObject = await getUserProfileFromId(region, headers, userId);

        callback(input.request);
    } catch (err) {
        error(`Error getting user profile details for userId: ${userId}. Error: ${err}`);
    }
};
