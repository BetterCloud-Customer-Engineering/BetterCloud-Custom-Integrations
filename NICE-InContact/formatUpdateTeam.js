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

    // Execution
    try {
        newRequestBody.id = body.teamId;

        // Check for change requests
        newRequestBody.name = body.newTeamName ?
            body.newTeamName :
            body.teamName;

        newRequestBody.status = body.newStatus;

        // Write back to request
        request.body = newRequestBody;

        // Send request to BetterCloud
        callback(request);
    } catch (err) {
        error(`Error formatting update team request. Error ${err}`);
    }
};
