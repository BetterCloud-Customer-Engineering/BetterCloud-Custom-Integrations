module.exports = async (input, callback, error) => {
    try {
        let request = input.request;
        request.url = request.url.replace('{name}', request.body.name);
        callback(request);
    } catch (err) {
        error(`addNameIntoUrl pre request script failed: ${err}`);
    }
};
