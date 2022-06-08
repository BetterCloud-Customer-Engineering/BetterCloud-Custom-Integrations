module.exports = async (input, callback, error) => {
    try{
        let request = input.request;
        let url = input.request.url;

        request.url = url.replace("{group_id}", request.body.group_id);
        delete request.body;

        callback(request);
    } catch (e) {
        error(`Error: ${e}`)
    }
}