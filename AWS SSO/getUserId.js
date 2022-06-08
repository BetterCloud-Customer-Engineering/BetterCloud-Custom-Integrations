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

const getUserId = async(error, accessToken, scimEndpoint, emailAttribute, email) => {
    try{
        const request = {
            method:"GET",
            url:`${scimEndpoint}/Users?filter=${emailAttribute} eq "${email}"`,
            headers:{
                "Content-Type":"application/json",
                "Authorization":`${accessToken}`
            }
        }

        const response = await axios(request);

        const resources = response.data.Resources;

        const matchingUsers = resources.filter( userObject => {

            const currentEmail = userObject[emailAttribute];

            return( currentEmail.toLowerCase() === email.toLowerCase() );
        });

        if ( matchingUsers.length === 1 ) return matchingUsers[0].id;
        if ( matchingUsers.length < 1 ) error(`Error getting userId, no matching users found with email ${email}`);
        if ( matchingUsers.length > 1 ) error(`Error getting userId, more than one match with email ${email}`);

    } catch (e) {
        error(`Error getting user id. Error: ${e}`);
    }
}

module.exports = async (input, callback, error) =>{
    try{
        const secrets = input.secrets;
        const userEmail = input.request.body.email;

        verifySecrets(secrets, ["auth_Authorization","scimEndpoint", "emailAttribute"], error);

        const accessToken = secrets.auth_Authorization;
        const scimEndpoint = secrets.scimEndpoint;
        const emailAttribute = secrets.emailAttribute;

        input.request.body.user_id = await getUserId(error, accessToken, scimEndpoint, emailAttribute, userEmail);

        callback(input.request)
    } catch (e) {
        error(`Error in getUserId module.exports. Error: ${e}`);
    }
}