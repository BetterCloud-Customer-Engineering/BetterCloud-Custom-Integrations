module.exports = async (input, callback, error) => {
    try {
        let request = input.request;
        request.url = request.url.replace('{groupName}', request.body.groupName);
        delete request.body.groupName;
        callback(request);
    } catch (err) {
        error(`injectGroupNameIntoURL pre request script failed: ${err}`);
    }
};
