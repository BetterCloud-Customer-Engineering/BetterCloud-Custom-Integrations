/**
 * 
 * @param input {Object} Input object must include: firstName, lastName, emailAddress, assignedGroup, role, userName, emailToBeVerified, and id
 * @param callback
 * @param error
 * @return {Promise<void>}
 */
module.exports = async (input, callback, error) => {
    let request = input.request;

    try {
        request.url = request.url.replace("{userId}", request.body.userId);
        delete request.body;

        callback(request);
    } catch (err) {
        error(`Error formatting revive user request. Error: ${err}`);
    }
};
