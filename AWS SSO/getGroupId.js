const axios = require('axios');

function verifySecrets(secrets, requiredSecretsArray, error){
    let missingVars = [];

    requiredSecretsArray.forEach( secretName => {
        if ( secrets[secretName] === undefined ) missingVars.push(secretName);
    });

    const numberMissing = missingVars.length;

    if (numberMissing === 0) return;
    if (numberMissing === 1){
        error(`${missingVars[0]} environment variable is missing in BetterCloud`);
        return;
    }
    if (numberMissing > 1){
        const vars = missingVars.join(", ");
        error(`${vars} environment variables are missing in BetterCloud`);
    }
}

const getGroupId = async(error, accessToken, scimEndpoint, displayName) => {
    try{
        const request = {
            method:"GET",
            url:`${scimEndpoint}/Groups?filter=displayName eq "${displayName}"`,
            headers:{
                "Content-Type":"application/json",
                "Authorization":`${accessToken}`
            }
        }

        const response = await axios(request);

        const resources = response.data.Resources;

        if ( resources.length === 1 ) return resources[0].id;
        if ( resources.length < 1 ) error(`Error getting group id, no matching group found with name ${displayName}`);
        if ( resources.length > 1 ) error(`Error getting group id, more than group with name ${displayName}`);

    } catch (e) {
        error(`Error getting group id. Error: ${e}`);
    }
}

module.exports = async (input, callback, error) =>{
    try{
        const secrets = input.secrets;
        const displayName = input.request.body.displayName;

        verifySecrets(secrets, ["auth_Authorization","scimEndpoint"], error);

        const accessToken = secrets.auth_Authorization;
        const scimEndpoint = secrets.scimEndpoint;

        input.request.body.group_id = await getGroupId(error, accessToken, scimEndpoint, displayName);

        callback(input.request)
    } catch (e) {
        error(`Error in getGroupId module.exports. Error: ${e}`);
    }
}