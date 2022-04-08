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

    const body = request.body,
        user = body.userObject;

    try {
        newRequestBody.id = user.id;

        // Check for change requests
        newRequestBody.emailAddress = body.emailAddress ?
            body.emailAddress :
            user.emailAddress;

        newRequestBody.firstName = body.firstName ?
            body.firstName :
            user.firstName;

        newRequestBody.lastName = body.lastName ?
            body.lastName :
            user.lastName;

        newRequestBody.mobileNumber = body.mobileNumber ?
            body.mobileNumber :
            user.mobileNumber;

        newRequestBody.assignedGroup = user.assignedGroup;

        newRequestBody.teamId = body.teamId ?
            body.teamId :
            user.teamId;

        newRequestBody.role = body.role ?
            body.role :
            user.role;

        newRequestBody.userName = body.userName ?
            body.userName :
            user.userName;

        request.body = newRequestBody;

        callback(request);
    } catch (err) {
        error(err);
    }
};
