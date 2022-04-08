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
        newRequestBody.id = body.teamId;

        // Check for change requests
        newRequestBody.name = body.teamName;
        newRequestBody.status = body.teamStatus;

        // Format custom attribute
        newRequestBody.customAttributes = {}
        newRequestBody.customAttributes[body.attributeName] = {
            "id": body.attributeName,
            "values": [
                {
                    "value": body.attributeState,
                    "resolvedValue": null
                }
            ]
        }
        // Write back to request
        request.body = newRequestBody;

        // Send request to BetterCloud
        callback(request);
    } catch (err) {
        error(`Error formatting update team request. Error ${err}`);
    }
};
