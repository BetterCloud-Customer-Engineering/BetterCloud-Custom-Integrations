const axios = require("axios");

const getAccessToken = async (secrets, error) => {
    try {
        const getAccessTokenRequest = {
            url: `https://${secrets.domain}.docebosaas.com/oauth2/token`,
            method: "POST",
            data: {
                "client_id" : secrets.clientId,
                "client_secret": secrets.clientSecret,
                "grant_type": "password",
                "scope": "api",
                "username": secrets.username,
                "password": secrets.password
            },
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        };

        const response = await axios(getAccessTokenRequest);
        return response.data.access_token;
    } catch (err) {
        error(`There was an error getting the access token: ${err}`);
    }
};

module.exports = async (input, callback, error) => {
    try {
        const accessToken = await getAccessToken(input.secrets, error);
        input.request.headers.Authorization = `Bearer ${accessToken}`;
        callback(input.request);
    } catch (err) {
        error(`getAccessToken Pre Request script failed: ${err}`)
    }
};