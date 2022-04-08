const axios = require("axios");
let errorCallback;

/**
 * @requestNiceInContactToken
 * @param {string} region - The base URL for NICE instance api
 * @param {string} keyId - The key id generated in the NICE admin console
 * @param {string} keySecret - The secret for the key generated in the NICE admin console
 * @return {object} {access_token, token_type, expires_in, refresh_token, id_token}
 *
 */

const requestNiceInContactToken = async (region, keyId, keySecret) => {
    const getTokenRequest = {
        method:'POST',
        url:`https://${region}.nice-incontact.com/authentication/v1/token/access-key`,
        headers:{
            "Content-Type":"application/json"
        },
        data:{
            accessKeyId:keyId,
            accessKeySecret:keySecret
        }
    };

    try{

        const accessToken = await axios(getTokenRequest);
        return(accessToken.data.access_token);

    } catch (err){
        errorCallback(`Error getting access token. Error:` + err);
    }
}

/**
 * @module.exports
 * @param {object} input - Input is an objects that includes environment information like secrets, as well as the body
 * of the original request as configured in BetterCloud.
 * @param {function} callback - Callback accepts a request object which will be passed to the next pre-request script or
 * the final BetterCloud call.
 * @param {function} error - Error is used to pass error messages back to BetterCloud logging.
 * @return {object} request - The request object
 *
 */

module.exports = async (input, callback, error) => {
    errorCallback = error;

    const keyId =  input.secrets["accessKeyId"],
        keySecret = input.secrets["accessKeySecret"],
        region = input.secrets.region;

    try {
        const accessToken = await requestNiceInContactToken(region, keyId, keySecret);
        input.request.headers.Authorization = `Bearer ${accessToken}`;

        callback(input.request);
    } catch (err) {
        error(`Error getting access token. Error ${err}`);
    }
};
