const axios = require('axios');
let secrets;
let errorCallback;
let apiToken;

const getTeamId = async (teamName) => {
    const request = {
        method: "GET",
        url: `https://api.frame.io/v2/teams`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `${apiToken}`
        }
    }

    try {
        const response = await axios(request);
        const matchingTeamName = response.data.filter(team => team.name.toLowerCase() === teamName.toLowerCase());
        if (matchingTeamName.length > 1) {
            errorCallback(`Multiple teams exist with that name: ${teamName}`)
        }
        else if (matchingTeamName.length === 1) {
            return matchingTeamName[0].id;
        }
        else {
            errorCallback(`No team exists with that team name: ${teamName}`);
        }
    } catch (err) {
        errorCallback(`Error finding team in your organization. Error: ${err}`);
    }
};

module.exports = async (input, callback, error) => {
    secrets = input.secrets;
    let request = input.request;
    let teamName = request.body.teamName;
    let url = request.url;
    apiToken = secrets.auth_Authorization;
    errorCallback = error;
    try {
        const teamId = await getTeamId(teamName);
        const updateInviteUrl = url.replace('{team_id}', teamId);
        request.url = updateInviteUrl;
        callback(request);
    } catch (err) {
        errorCallback(err);
    }
};