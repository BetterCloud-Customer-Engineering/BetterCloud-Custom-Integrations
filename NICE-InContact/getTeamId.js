const axios = require("axios");
let errorCallback;

const getTeamIdFromTeamName = async (region, headers, body) => {
    const teamName = body.teamName;

    const request_getTeamId = {
        method:'POST',
        url:`https://${region}.nice-incontact.com/user-management/v3/teams/search`,
        headers:headers,
        data:{
            "fields":["id","name","status"],
                "filter":{
                "name":[`${teamName}`]
            },
            "operations":{
                "name":"EQ"
            }
        }
    }

    try{
        const response_getTeamId = await axios(request_getTeamId);

        if(response_getTeamId.data.totalRecords === 1){
            return(response_getTeamId.data.teams[0])
        }else{
            response_getTeamId.data.totalRecords < 1 ?
                errorCallback(`No Teams found with name: ${teamName}`) :
                errorCallback(`Multiple Teams found with name: ${teamName}`);
        }
    } catch (err){
        errorCallback(`Error requesting team id for team with name ${teamName}. Error:` + err);
    }
}

module.exports = async (input, callback, error) => {
    // Globals
    errorCallback = error;

    // Setup
    const region = input.secrets.region;

    let request = input.request,
        headers = input.request.headers,
        body = input.request.body;

    // Execution
    try {
        if(request.body.teamName !== null) {
            let teamDetails = await getTeamIdFromTeamName(region, headers, body);
            request.body.teamId = teamDetails.id;
            request.body.teamStatus = teamDetails.status;
        }

        callback(request);
    } catch (err) {
        error(`Error getting teamId. Error: ${err}`);
    }
};
