module.exports = async (input, callback, error) => {
    try {
        // Scoped Variables
        let request = input.request;

        // Format workEmail
        let workEmail = `${request.body.firstName.substring(0, 1)}${request.body.lastName}@${request.body.emailDomain}`;

        // Format Request
        request.headers = {
            "Content-Type":"application/json",
            "Accept":"application/json",
            "Authorization": request.headers.Authorization
        }

        // Must be passed as DATA
        request.data = {
            "workEmail": workEmail.toLowerCase()
        }

        delete request.body;

        callback(request);

    } catch (e) {
        error(`Error in update user request formatting: ${e}`)
    }
}
