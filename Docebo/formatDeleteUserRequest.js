module.exports = async (input, callback, error) => {
    try {
        const newBody = {"user_names": [input.request.body.email]};
        input.request.body = newBody;
        callback(input.request);
    } catch (err) {
        error(`formatDeleteUserRequest failed: ${err}`);
    }
};
