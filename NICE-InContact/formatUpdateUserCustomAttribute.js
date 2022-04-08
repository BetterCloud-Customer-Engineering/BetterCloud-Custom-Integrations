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

    // Execute
    try {
        newRequestBody.id = user.id;

        // Fill in obligatory properties
        newRequestBody.firstName = user.firstName;
        newRequestBody.lastName = user.lastName;
        newRequestBody.emailAddress = user.emailAddress;
        newRequestBody.assignedGroup = user.assignedGroup;
        newRequestBody.role = user.role;
        newRequestBody.userName = user.userName;

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

        request.body = newRequestBody;

        callback(request);
    } catch (err) {
        error(`Error formatting Update User Attribute request. Error: ${err}`);
    }
};
