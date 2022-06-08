module.exports = async (input, callback, error) => {
    try{
        let request = input.request;
        let url = input.request.url;

        request.url = url.replace("{user_id}", request.body.user_id);
        delete request.body;

        callback(request);
    } catch (e) {
        error(`Error: ${e}`)
    }
}