module.exports = async (input, callback, error) => {
    try {
        let request = input.request;
        request.url = request.url.replace('{username}', request.body.username);
        delete request.body.username;
        callback(request);
    } catch (err) {
        error(`injectUsernameIntoURL pre request script failed: ${err}`);
    }
};
