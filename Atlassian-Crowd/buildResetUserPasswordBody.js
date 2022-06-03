module.exports = async (input, callback, error) => {
    try {
        let request = input.request;
        delete request.body.name;
        callback(request);
    } catch (err) {
        error(`buildResetUserPasswordBody pre request script failed: ${err}`);
    }
};
