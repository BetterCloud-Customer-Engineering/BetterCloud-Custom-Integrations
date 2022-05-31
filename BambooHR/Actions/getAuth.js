let errorCallback;

function base64encode (apiKey, prefix, postfix){
    try {
        const preFix = "";
        const postFix = ":x";
        let buff = Buffer.from(preFix + apiKey + postFix);
        let stringToBase64 = buff.toString('base64');
        return (stringToBase64);
    } catch (e) {
        errorCallback(`Error encoding apiKey`);
    }
}


module.exports = async (input, callback, error) => {
    // Global Variables
    errorCallback = error;

    try {
        // Scoped Variables
        const secrets = input.secrets;
        let request = input.request;

        // Set encoded Auth header
        const base64key = base64encode(secrets.apiKey, "", ":x");

        // Format Request
        request.headers.Authorization = `Basic ${base64key}`;

        callback(request);

    } catch (e) {
        error(`Error in getAuth pre-request script: ${e}`)
    }
}
