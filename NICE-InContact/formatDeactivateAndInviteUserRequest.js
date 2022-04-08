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
        let body = {
            "inviteUserIds": [request.body.userId]
        }

        if(input.request.body.senderEmail){
            body.senderUserId = request.body.senderUserId;
        }

        request.body = body;

        callback(request);
    } catch (err) {
        error(`Error formatting request. Error: ${err}`);
    }
};
