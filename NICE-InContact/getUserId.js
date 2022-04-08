const axios = require("axios");
let errorCallback;

const getUserIdFromUserEmail = async (region, headers, email) => {

    const request_getUsers = {
        method:'GET',
        url:`https://${region}.nice-incontact.com/user-management/v1/users`,
        headers:headers
        ,params:{
            "includeDeleted":true
        }
    }

    try{
        const response_getUsers = await axios(request_getUsers);
        const users = response_getUsers.data.users;
        const userMatches = users.filter( user => {
            return user.emailAddress.toLowerCase() === email.toLowerCase();
        })

        if(userMatches.length === 1){
            return(userMatches[0].id)
        }else{
            userMatches.length < 1 ?
                errorCallback(`No user found with email: ${email}`) :
                errorCallback(`Multiple users found with email: ${email}`);
        }
    } catch (err){
        errorCallback(`Error finding user id for email: ${emailAddress}. Error:` + err);
    }
}

module.exports = async (input, callback, error) => {
    // Globals
    errorCallback = error;

    // Setup
    let headers = input.request.headers,
        userEmail = input.request.body.userEmailAddress,
        region = input.secrets.region;

    // Execution
    try {

        input.request.body.userId = await getUserIdFromUserEmail(region, headers, userEmail);

        if(input.request.body.senderEmail){
            let senderEmail = input.request.body.senderEmail;
            input.request.body.senderUserId = await getUserIdFromUserEmail(region, headers, senderEmail);
        }

        callback(input.request);
    } catch (err) {
        error(`Error in getUserId. Error: ${err}`);
    }
};
