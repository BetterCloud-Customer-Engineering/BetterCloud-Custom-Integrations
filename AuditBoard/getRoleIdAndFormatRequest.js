const axios = require('axios');
let errorCallback;

const userAlreadyExists = async (baseUrl, apiKey, email) => {

    const getUserUrl = `${baseUrl}/Users?filter=email eq "${email}"`

    const getUserRequest = {
        method: 'GET',
        url: getUserUrl,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization':apiKey
        }
    };
    try {
        const response = await axios(getUserRequest);
        const users = response.data.Resources,
            matchingUser = users.find(user => user.email.toLowerCase() === email);
        if (matchingUser)
            errorCallback(`Error: User with email, ${email}, already exists`);

    } catch (err) {
        errorCallback(`Error checking for Insight user. Error: ${err}`);
    }
};

const getAuditBoardRoleId = async (baseUrl, apiKey, roleName) => {
    const getUserRequest = {
        method: "GET",
        url: baseUrl + "/Groups",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization':apiKey
        }
    };
    try {
        const response = await axios(getUserRequest);
        const groups = response.data.Resources,
            matchingRoleId = groups.find(group => group.displayName === roleName);
        if (matchingRoleId)
            return matchingRoleId.id;
        else
            errorCallback(`No group found with display name ${roleName}.`);
    } catch (err) {
        console.log(err);
        errorCallback(`Error finding group with display name ${roleName}. Error: ${err}`);
    }
};

function formatCreateOrgUserRequest(baseUrl, apiKey, requestBody, roleId) {
    const formattedRequest = {
        method: 'POST',
        url: baseUrl + "/Users",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": apiKey
        },
        body: {
            "schemas": [
                "urn:ietf:params:scim:schemas:core:2.0:User"
            ],
            "emails": [
                {
                    "value": requestBody.email,
                    "type": "work",
                    "primary": true
                }
            ],
            "name": {
                "givenName": requestBody.givenName,
                "familyName": requestBody.familyName
            },
            "title":requestBody.title
        }
    }
    if(requestBody.userName){
        formattedRequest.body.userName = requestBody.userName;
    }
    if(requestBody.roleId){
        formattedRequest.body.roles = [{
            "value": roleId,
            "primary": true
        }];
    }
    return(formattedRequest);
}

module.exports = async (input, callback, error) => {
    let request = input.request,
        requestBody = request.body,
        email = requestBody.email,
        roleName = requestBody.roleName;

    let baseUrl = input.secrets["baseUrl"],
        apiKey = input.secrets["auth_Authorization"];

    errorCallback = error;

    try {
        await userAlreadyExists(baseUrl, apiKey, email);
        if(requestBody.roleName) {
            requestBody.roleId = await getAuditBoardRoleId(baseUrl, apiKey, roleName);
            delete requestBody.roleName;
        }
        input.request = formatCreateOrgUserRequest(baseUrl, apiKey, requestBody);
        callback(input.request);
    } catch (err) {
        console.log(err);
        error(err);
    }
};
