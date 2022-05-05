const axios = require('axios');
let errorCallback;

const getUserUUIDbyEmail = async (authorization, email) => {
    try {
        const paramString = `search={"Email":${email}}`;
        const searchParam = new URLSearchParams(paramString);

        let request = {
            method: "GET",
            url: `https://api.gan-compliance.com/api/v1/users?${searchParam}`,
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json",
                "Authorization": authorization
            },
        };
        let response = await axios(request);
        let users = response.data || null;

        const numberOfMatchedUsers = users.length;

        if( numberOfMatchedUsers === 1 ){
            const uuid = users[0].uuid;
            return (uuid);
        }
        if( numberOfMatchedUsers < 1 ) { errorCallback(`Error No users found with email: ${email}`) }
        if( numberOfMatchedUsers > 1 ) { errorCallback(`Error Multiple users found with email: ${email}`) }

    } catch (err) {
        error(`Error in getUserUUIDbyEmail function. Error: ${err}`);
    }
};


module.exports = async (input, callback, error) => {
    try {
        // Globals: BetterCloud related
        errorCallback = error;

        // Scoped: Request related
        let request = input.request;
        const authorization = request.headers.Authorization,
              email = request.body.email;

        // Calls
        const uuid = await getUserUUIDbyEmail(authorization, email);

        // Request Modification
        request.url = request.url.replace(/{uuid}/g,uuid);

        // Handoff
        callback(request);
    } catch (err) {
        error(`Error in getUserUUID pre-request module.exports function. Error: ${err}`);
    }
};