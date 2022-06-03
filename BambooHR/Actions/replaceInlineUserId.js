module.exports = async (input, callback, error) => {
    try {
        // Scoped Variables
        let request = input.request;

        const userId = request.body.userId;

        // Get userId via firstName lastName search
        request.url = request.url.replace("{id}", userId);

        callback(request);

    } catch (e) {
        error(`Error setting userId in URL. Error: ${e}`);
    }
}