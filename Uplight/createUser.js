const axios = require('axios');
let secrets;
let authKey;
let errorCallback;

let baseUrl = "https://uplight.auditboardapp.com/api/v1/scim";


function formatCreateOrgUserRequest(uplightUserParams, roleId) {
    return {
        method: 'POST',
        url: baseUrl,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${secrets.auth_Authorization}`
        },
        body: {
            "schemas": [
                "urn:ietf:params:scim:schemas:core:2.0:User"
            ],
            "emails": [
                {
                    "value": uplightUserParams.email,
                    "type": "work",
                    "primary": true
                }
            ],
            "userName": uplightUserParams.userName,
            "name": {
                "givenName": uplightUserParams.firstName,
                "familyName": uplightUserParams.lastName
            },
            "title":uplightUserParams.title,
            "roles":[{
                "value": roleId
            }]

        }
    }
}

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

const getUplightRoleId = async (email) => {

    let url = `https://${secrets.insightRegion}.api.insight.rapid7.com/account/api/1/users?email=${email}`

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
        email = requestBody.email.toLowerCase().trim(),
        role = requestBody.role;

    authKey = secrets["auth_x-api-key"];
    errorCallback = error;

    try {
        const userId = await getUplightUserId(email);
        const roleId = await getUplightRoleId(role);
        request.url = request.url.replace('{userId}', userId);
        request.url = request.url.replace('{roleId}', roleId);
        delete request.body.email;
        callback(request);
    } catch (err) {
        error(err);
    }
};

