// Notes
/* Fields
<Notes about the fields used in integration>
*/

//region Packages
const axios = require("axios");
//endregion

//region Generic Config
let input = {
    payload: null,
    environment: null,
    headers: {},
    secrets: {
        // Secrets stored in the Basic Information tab are stored with auth_ in the name.
        auth_Authorization:"Bearer <key>",

        // Environment variables
        baseUrl:"saasTenant.application.com",
    }
};
//endregion

//region Action: Create User
//Add scripts that you wish to run in succession here using the ./fileName seperated by commas.
const scripts = ['./formatCreateUserRequest.js'].map(require);

//Add information used in the Action configuration screen here.
input.request = {
    method:"POST",
    url: `<url>`,
    headers: {
        "X-Tenant-Name":"<name>",
        "Content-Type":"application/json",
        "Accept":"application/json"
    },
    body: {
        "firstName":"BetterCloud",
        "lastName":"Testing",
        "email":"testing3@guardiansofthe.cloud",
        "language":"en-US",
        "roleName":"User",
        "hireDate":"2022-05-18"
    }
}
//endregion

//region Action: Update User
// const scripts = ['./getUserProfileFromEmail.js','./replacePathVarUUID','./formatUpdateUserRequest'].map(require);
// input.request = {
//     method:"PATCH",
//     url: `<url>`,
//     headers: {
//         "X-Tenant-Name":"<name>",
//         "Content-Type":"application/json",
//         "Accept":"application/json"
//     },
//     body: {
//         "firstName":undefined,
//         "lastName":"Testing",
//         "email":"testing2@guardiansofthe.cloud",
//         "newEmail":"testing@guardiansofthe.cloud",
//         "language":"en-US",
//         "hireDate":"2022-05-18"
//     }
// }
//endregion

//region Action: ...
// const scripts = ['./getUserProfileFromEmail.js'].map(require);
// input.request = {
//     method:"",
//     url: ``,
//     headers: {

//     },
//     body: {

//     }
// }
//endregion

//region BetterCloud Emulation Functions

let callback = function (webhookRequest) {
    input.request = webhookRequest;
};

let error = function (name) {
    console.log("Failed: " + name);
};

async function executeWebhook(request) {

    axios(rebuiltRequest).then(response => {
        console.log("Webhook Request: " + JSON.stringify(rebuiltRequest));
        console.log("Webhook Response: " + JSON.stringify(response.data));
    }).catch(err => {
        console.log("Webhook Request Error: " + err)
    })
}

async function forOf() {
    let result = [];

    for (const property in input.secrets) {
        if(property.indexOf("auth_") !== -1){
            const injectedAuthHeaderKey = property.replace("auth_","");
            input.request.headers[injectedAuthHeaderKey] = input.secrets[property];
        }
    }

    if( typeof(input.request.payload) === 'object' ) {
        if (input.request.method === "GET" || input.request.method === "POST") {
            if (!input.request.headers["Content-Type"]) {
                input.request.headers["Content-Type"] = "application/json;charset=UTF-8";
            }
            if (!input.request.headers["Accept"]) {
                input.request.headers["Accept"] = "application/json;charset=UTF-8";
            }
        }
    }

    for (const script of scripts) {
        result.push(await script(input, callback, error))
    }

    return executeWebhook(input.request);
}

forOf();

//endregion


