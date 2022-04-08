/**
 * 
 * @param input {Object} Input object must include: firstName, lastName, emailAddress, assignedGroup, role, userName, emailToBeVerified, and id
 * @param callback
 * @param error
 * @return {Promise<void>}
 */

module.exports = async (input, callback, error) => {
    // Setup
    let request = input.request,
        newRequestBody = {};

    const body = request.body;

    try {
        // Required fields
        newRequestBody.firstName = body.firstName;
        newRequestBody.lastName = body.lastName;
        newRequestBody.emailAddress = body.userEmailAddress;
        newRequestBody.role = body.role;

        // Optional
        if(body.mobileNumber){
            newRequestBody.mobileNumber = body.mobileNumber
        }

        if(body.assignedGroup){
            newRequestBody.assignedGroup = body.assignedGroup;
        }

        if(body.teamId){
            newRequestBody.teamId = body.teamId;
        }

        if(body.userName){
            newRequestBody.userName = body.userName
        }

        // Replace request body
        request.body = newRequestBody;

        callback(request);
    } catch (err) {
        error(`Error formatting Create User request. Error: ${err}`);
    }
};
